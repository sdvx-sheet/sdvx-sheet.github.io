function showError(msg) {
    // TODO
}

function NoteElement(len, fx, measure, beat, subbeat) {
    this.len = len;
    this.fx = fx;
    this.measure = measure;
    this.beat = beat;
    this.subbeat = subbeat;
}

function LongNoteStatus(start_bool, fx, len, measure, beat, subbeat) {
    this.start_bool = start_bool;
    this.fx = fx;
    this.len = len;
    this.measure = measure;
    this.beat = beat;
    this.subbeat = subbeat;
}

function VolElement(pos, type, fx, measure, beat, subbeat) {
    this.pos = pos;
    this.type = type;
    this.fx = fx;
    this.measure = measure;
    this.beat = beat;
    this.subbeat = subbeat;
}

function VolStatus(start_bool, last_pos, vol_time, measure, beat, subbeat) {
    this.start_bool = start_bool;
    this.last_pos = last_pos;
    this.vol_time = vol_time;
    this.last_measure = measure;
    this.last_beat = beat;
    this.last_subbeat = subbeat;
}

var KshSheet = {
    beatInfo: [],   // [pre_beat, after_beat, measure, beat, b_48]
    endPos: [1, 0, 0],
    bpmList: [], // [bpm, measure, beat, subbeat]
    notes: [[], [], [], [], [], []], // [A, B, C, D, FX-L, FX-R]
    noteStatus: [],
    vols: [[], []],  // [Blue, Red]
    volStatus: [new VolStatus(false, 0, 0, 0, 0, 0), new VolStatus(false, 0, 0, 0, 0, 0)]
};

function getTotalCByMeasureInfo(measure, beat, subbeat) {
    var beat_info_len = window.KshSheet.beatInfo.length;
    var total_c = 0;
    for (var i = 0; i < beat_info_len; i++) {
        var current_beat_info = window.KshSheet.beatInfo[i];
        // 檢查是否是最後一個 beat, 是的話直接計算答案
        if (i == beat_info_len - 1) {
            total_c += ((measure - current_beat_info[2]) * current_beat_info[0] + beat - 1) * (48 * 4 / current_beat_info[1]) + subbeat;
        } else {
            // 檢查目標是否超過下一個目的地，超過的話直接加上整段的 c
            var next_beat_info = window.KshSheet.beatInfo[i + 1];
            if (measure >= next_beat_info[2]) {
                total_c += ((next_beat_info[2] - current_beat_info[2]) * current_beat_info[0]) * (48 * 4 / current_beat_info[1]);
            }
                // 否則只需要直接計算答案並 break
            else {
                total_c += ((measure - current_beat_info[2]) * current_beat_info[0] + beat - 1) * (48 * 4 / current_beat_info[1]) + subbeat;
                break;
            }
        }
    }
    return total_c;
}

function addNewBeat(pre_beat, after_beat, measure, beat, b_48) {
    window.KshSheet.beatInfo.push([pre_beat, after_beat, measure, beat, b_48]);
}

function setEndPos(measure, beat, b_48) {
    window.KshSheet.endPos = [measure, beat, b_48];
}

function clearBpm() {
    window.KshSheet.bpmList = [];
}

function addNewBpm(bpm, measure, beat, subbeat) {
    window.KshSheet.bpmList.push([bpm, measure, beat, subbeat]);
}

function getCurrentSubbeatPerBeat() {
    var current_beat_info = window.KshSheet.beatInfo[window.KshSheet.beatInfo.length - 1];
    return 48 * 4 / current_beat_info[1];
}

function getPreBeat() {
    var current_beat_info = window.KshSheet.beatInfo[window.KshSheet.beatInfo.length - 1];
    return current_beat_info[0];
}

// Note functions
function addNewNoteShort(i, fx, measure, beat, subbeat) {
    window.KshSheet.notes[i].push(new NoteElement(0, fx, measure, beat, subbeat));
}

function appendLongNoteTime(i, subbeat) {
    window.KshSheet.noteStatus[i].len += subbeat;
}

function addNewNoteLongStart(i, fx, measure, beat, subbeat) {
    var current_subbeat = getCurrentSubbeatPerBeat();
    var long_time = -((beat - 1) * current_subbeat + subbeat);
    window.KshSheet.noteStatus[i] = new LongNoteStatus(true, fx, long_time, measure, beat, subbeat);
}

function addNewNoteLongEnd(i, measure, beat, subbeat) {
    var current_note_status = window.KshSheet.noteStatus[i];
    if (current_note_status.start_bool == false) return;
    current_note_status.start_bool = false;

    var current_subbeat = getCurrentSubbeatPerBeat();
    appendLongNoteTime(i, (beat - 1) * current_subbeat + subbeat);
    window.KshSheet.notes[i].push(new NoteElement(current_note_status.len,
        current_note_status.fx,
        current_note_status.measure,
        current_note_status.beat,
        current_note_status.subbeat));
}

// Vol functions
function addNewVol(i, pos, fx, measure, beat, subbeat) {
    var current_subbeat_in_measure = (beat - 1) * getCurrentSubbeatPerBeat() + subbeat;
    appendVolTime(i, current_subbeat_in_measure);

    var current_vol_status = window.KshSheet.volStatus[i];

    if (current_vol_status.start_bool == false) {    // Vol Start
        current_vol_status.start_bool = true;
        window.KshSheet.vols[i].push(new VolElement(pos,
            1,
            fx,
            measure,
            beat,
            subbeat));
    } else {    // Vol Continue
        // 旋鈕原地不動
        if (pos == current_vol_status.last_pos) {
            window.KshSheet.vols[i].push(new VolElement(pos,
                0,
                fx,
                measure,
                beat,
                subbeat));
        }
            // 直角旋鈕
        else if (current_vol_status.vol_time <= 6) {
            window.KshSheet.vols[i].push(new VolElement(pos,
                0,
                fx,
                current_vol_status.last_measure,
                current_vol_status.last_beat,
                current_vol_status.last_subbeat));
        }
            // 普通的旋鈕
        else {
            window.KshSheet.vols[i].push(new VolElement(pos,
                0,
                fx,
                measure,
                beat,
                subbeat));
        }
    }

    current_vol_status.vol_time = -current_subbeat_in_measure;
    current_vol_status.last_pos = pos;
    current_vol_status.last_measure = measure;
    current_vol_status.last_beat = beat;
    current_vol_status.last_subbeat = subbeat;
}

function appendVolTime(i, subbeat) {
    window.KshSheet.volStatus[i].vol_time += subbeat;
}

function updateVolEnd(i, beat, subbeat) {
    window.KshSheet.vols[i][window.KshSheet.vols[i].length - 1].type = 2;
    var current_vol_status = window.KshSheet.volStatus[i];
    current_vol_status.start_bool = false;
    var current_subbeat_in_measure = (beat - 1) * getCurrentSubbeatPerBeat() + subbeat;
    current_vol_status.vol_time = -current_subbeat_in_measure;
}


function parseMetadata(metadata_str) {
    var metadata_split_line = metadata_str.split("\n");
    var metadata = null;
    for (var line_index in metadata_split_line) {
        var current_line = metadata_split_line[line_index];
        if (current_line.search("t=") == 0) {
            metadata = {
                t: parseInt(current_line.substr(2), 10)
            };
        }
    }
    return metadata;
}

var longNoteStatus = [false, false, false, false, false, false];
var volStatus = [false, false];

function parseMusicBody(music_body_split_dash) {
    var first_note_appeared = false;
    var long_note_status = [false, false, false, false, false, false];
    var vol_status = [false, false];
    music_body_split_dash = music_body_split_dash.filter(function (x) { return x.trim() != "" });
    for (var dash_index in music_body_split_dash) {
        var current_measure_split_line = music_body_split_dash[dash_index].split("\n").filter(function (x) { return x.trim() != ""; });
        var measure = parseInt(dash_index, 10) + 1;
        // START: each measure
        // 計算有效行數
        var line_sum = current_measure_split_line.filter(function (x) {
            return x.search("=") == -1;
        }).length;
        var line_count = 0;
        var i;
        for (var line_index in current_measure_split_line) {
            var current_line = current_measure_split_line[line_index];
            // START: each line
            var equal_pos, slash_pos;
            if (first_note_appeared == false) {
                if (current_line.search("beat=") == -1) {
                    first_note_appeared = true;
                    addNewBeat(4, 4, 1, 1, 0);
                } else {
                    equal_pos = current_line.search("=");
                    slash_pos = current_line.indexOf("/", equal_pos + 1);
                    addNewBeat(parseInt(current_line.substr(equal_pos + 1, slash_pos), 10),
                        parseInt(current_line.substr(slash_pos + 1), 10),
                        1, 1, 0);
                    first_note_appeared = true;
                }
            }

            var current_beat_info = window.KshSheet.beatInfo[window.KshSheet.beatInfo.length - 1];
            var subbeat_per_measure = 48 * 4 / current_beat_info[1] * current_beat_info[0];
            var subbeat_per_line = subbeat_per_measure / line_sum;
            var current_line_subbeat = subbeat_per_line * line_count;

            var beat = Math.floor(current_line_subbeat / (48 * 4 / current_beat_info[1]) + 1);
            var subbeat = current_line_subbeat % (48 * 4 / current_beat_info[1]);

            // 檢查特殊指令
            if ((equal_pos = current_line.search("=")) != -1) {
                var pre_command = current_line.substr(0, equal_pos);
                if (pre_command == "beat") {
                    if (!(measure == 1 && beat == 1 && subbeat == 0)) {
                        slash_pos = current_line.indexOf("/", equal_pos + 1);
                        addNewBeat(parseInt(current_line.substr(equal_pos + 1, slash_pos), 10),
                            parseInt(current_line.substr(slash_pos + 1)),
                            measure,
                            beat,
                            subbeat);
                    }
                } else if (pre_command == "t") {
                    var new_bpm = current_line.substr(equal_pos + 1);
                    if (measure == 1 && beat == 1 && subbeat == 0) {
                        clearBpm();
                    }
                    addNewBpm(parseFloat(new_bpm),
                        measure,
                        beat,
                        subbeat);
                }
            } else if (current_line[0] == '0' || current_line[0] == '1' || current_line[0] == '2') {
                // 分析按鈕資料
                var note_pos = [0, 1, 2, 3, 5, 6];
                for (i = 0; i != 6; i++) {
                    var current_note_char = current_line[note_pos[i]];
                    // 停止按鍵
                    if (current_note_char == '0') {
                        // 檢查長鍵狀態
                        if (long_note_status[i] == true) {
                            addNewNoteLongEnd(i, measure, beat, subbeat);
                            long_note_status[i] = false;
                        }
                    }
                        // 短鍵
                    else if ((i < 4 && current_note_char == '1') || (i >= 4 && current_note_char == '2')) {
                        addNewNoteShort(i, 0, measure, beat, subbeat);
                    }
                        // 長白鍵
                    else if (i < 4 && current_note_char == '2') {
                        if (long_note_status[i] == false) {
                            addNewNoteLongStart(i, 2, measure, beat, subbeat);
                        }
                        long_note_status[i] = true;
                    }
                        // 長黃鍵
                    else if (i >= 4 && current_note_char != '2') {
                        if (long_note_status[i] == false) {
                            addNewNoteLongStart(i, 0, measure, beat, subbeat);
                        }
                        long_note_status[i] = true;
                    }
                }

                // 分析旋鈕資料
                var vol_pos = [8, 9];
                for (i = 0; i != 2; i++) {
                    var vol_char = current_line[vol_pos[i]];
                    // 旋鈕停止
                    if (vol_char == '-') {
                        if (vol_status[i] == true) {
                            updateVolEnd(i, beat, subbeat);
                            vol_status[i] = false;
                        }
                    }
                        // 旋鈕繼續
                    else if (vol_char == ':') {
                        // 不做任何事
                    }
                    else if ((vol_char >= '0' && vol_char <= '9') || (vol_char >= 'A' && vol_char <= 'Z') || (vol_char >= 'a' && vol_char <= 'o')) {
                        // 計算 position
                        var p = 0;
                        if (vol_char >= '0' && vol_char <= '9') {
                            p = vol_char.charCodeAt(0) - 48;
                        } else if (vol_char >= 'A' && vol_char <= 'Z') {
                            p = vol_char.charCodeAt(0) - 65 + (57 - 48 + 1);
                        } else {
                            p = vol_char.charCodeAt(0) - 97 + (90 - 65 + 1) + (57 - 48 + 1);
                        }
                        var pos = Math.floor(p / (57 - 48 + 1 + 90 - 65 + 1 + 111 - 97) * 128);
                        if (pos == 128) {
                            pos = 127;
                        }

                        addNewVol(i, pos, 0, measure, beat, subbeat);
                        vol_status[i] = true;
                    }
                }

                line_count++;
            }
        }

        // 小節分析結束之後，將長條的持續時間延長
        for (i = 0; i != 6; i++) {
            if (long_note_status[i] == true) {
                appendLongNoteTime(i, getCurrentSubbeatPerBeat() * getPreBeat());
            }
        }
        // 小節分析結束之後，將旋鈕的持續時間延長
        for (i = 0; i != 2; i++) {
            appendVolTime(i, getCurrentSubbeatPerBeat() * getPreBeat());
        }
    }

    setEndPos(music_body_split_dash.length + 1, 1, 0);
}

function measureEqual(lhs, rhs) {
    for (var i = 0; i != 3; i++) {
        if (lhs[i] != rhs[i])
            return false;
    }
    return true;
}

function outputNote(note, pos) {
    // short
    if (note.len <= 0) {
        // FX
        if (pos >= 4) {
            return "addFX(svg_short, " + (pos - 4) + ", " + getTotalCByMeasureInfo(note.measure, note.beat, note.subbeat) + ");\n";
        }
            // Note
        else {
            return "addNote(svg_short, " + pos + ", " + getTotalCByMeasureInfo(note.measure, note.beat, note.subbeat) + ");\n";
        }
    }
        // long
    else {
        // FX
        var total_c_start;
        var total_c_end;
        if (pos >= 4) {
            total_c_start = getTotalCByMeasureInfo(note.measure, note.beat, note.subbeat);
            total_c_end = total_c_start + note.len;
            return "addFXLong(svg_long, " + (pos - 4) + ", " + total_c_start + ", " + total_c_end + ");\n";
        }
            // Note
        else {
            total_c_start = getTotalCByMeasureInfo(note.measure, note.beat, note.subbeat);
            total_c_end = total_c_start + note.len;
            return "addNoteLong(svg_long, " + pos + ", " + total_c_start + ", " + total_c_end + ");\n";
        }
    }
}

function outputAnalog(pos) {
    var output = "";

    var current_analog_state = -1;
    var last_total_c = 0;
    var last_x = 0;
    for (var vol_index in window.KshSheet.vols[pos]) {
        var current_vol = window.KshSheet.vols[pos][vol_index];
        var current_total_c = getTotalCByMeasureInfo(current_vol.measure, current_vol.beat, current_vol.subbeat);
        var current_vol_output_pos = current_vol.pos / 127 * 250;
        // 持續狀態的旋鈕
        if (current_vol.type == 0) {
            if (last_total_c == current_total_c) {
                if (last_x < current_vol_output_pos) {
                    output += "addOrthogonal(svg_analog, " + pos + ", " + last_x + ", " + current_vol_output_pos + ", " + current_total_c + ");\n";
                } else {
                    output += "addOrthogonal(svg_analog, " + pos + ", " + current_vol_output_pos + ", " + last_x + ", " + current_total_c + ");\n";
                }
            } else {
                output += "addPath(svg_analog, " + pos + ", " + last_x + ", " + current_vol_output_pos + ", " + last_total_c + ", " + current_total_c + ");\n";
            }
            last_x = current_vol_output_pos;
            last_total_c = current_total_c;
        }
            // 開始的旋鈕
        else if (current_vol.type == 1) {
            last_x = current_vol_output_pos;
            last_total_c = current_total_c;
        }
            // 結束的旋鈕
        else if (current_vol.type == 2) {
            if (last_total_c == current_total_c) {
                if (last_x < current_vol_output_pos) {
                    output += "addOrthogonal(svg_analog, " + pos + ", " + last_x + ", " + current_vol_output_pos + ", " + current_total_c + ");\n";
                    output += "addPath(svg_analog, " + pos + ", " + current_vol_output_pos + ", " + current_vol_output_pos + ", " + current_total_c + ", " + (current_total_c + 12) + ");\n";
                } else {
                    output += "addOrthogonal(svg_analog, " + pos + ", " + current_vol_output_pos + ", " + last_x + ", " + current_total_c + ");\n";
                    output += "addPath(svg_analog, " + pos + ", " + current_vol_output_pos + ", " + current_vol_output_pos + ", " + current_total_c + ", " + (current_total_c + 12) + ");\n";
                }
            } else {
                output += "addPath(svg_analog, " + pos + ", " + last_x + ", " + current_vol_output_pos + ", " + last_total_c + ", " + current_total_c + ");\n";
            }
            last_x = current_vol_output_pos;
            last_total_c = current_total_c;
        }
    }

    return output;
}

function outputSheet() {
    var output = "";
    // FinishC
    output += "setFinishC(" + getTotalCByMeasureInfo(window.KshSheet.endPos[0], window.KshSheet.endPos[1], window.KshSheet.endPos[2]) + ");\n";

    // BPMs
    for (var bpm_info_index in window.KshSheet.bpmList) {
        var current_bpm_info = window.KshSheet.bpmList[bpm_info_index];
        output += "addBPM(svg_bpm, " + current_bpm_info[0] + ", " + getTotalCByMeasureInfo(current_bpm_info[1], current_bpm_info[2], current_bpm_info[3]) + ");\n";
    }

    // initialSheetTimeline()
    output += "initialSheetTimeline();\n";

    // addAllMeasurePolygon(svg_measure, finish_c)
    output += "addAllMeasurePolygon(svg_measure, finish_c / 48);\n";

    // FXs
    var note_index;
    var current_note;
    var note_pos;
    for (note_pos = 4; note_pos <= 5; note_pos++) {
        for (note_index in window.KshSheet.notes[note_pos]) {
            current_note = window.KshSheet.notes[note_pos][note_index];
            output += outputNote(current_note, note_pos);
        }
    }

    // Notes
    for (note_pos = 0; note_pos <= 3; note_pos++) {
        for (note_index in window.KshSheet.notes[note_pos]) {
            current_note = window.KshSheet.notes[note_pos][note_index];
            output += outputNote(current_note, note_pos);
        }
    }

    // Analogs
    for (var analog_pos = 0; analog_pos <= 1; analog_pos++) {
        output += outputAnalog(analog_pos);
    }

    return output;
}

function parseKsh(str) {
    KshSheet = {
        beatInfo: [],   // [pre_beat, after_beat, measure, beat, b_48]
        endPos: [1, 0, 0],
        bpmList: [], // [bpm, measure, beat, subbeat]
        notes: [[], [], [], [], [], []], // [A, B, C, D, FX-L, FX-R]
        noteStatus: [],
        vols: [[], []],  // [Blue, Red]
        volStatus: [new VolStatus(false, 0, 0, 0, 0, 0), new VolStatus(false, 0, 0, 0, 0, 0)]
    };

    var input_ksh_split_dash = str.split("\n--");
    var metadata_str = input_ksh_split_dash[0];
    var metadata = parseMetadata(metadata_str);
    if (metadata == null) {
        showError("No BPM found in metadata.");
        return "alert('No BPM found in metadata');";
    }
    addNewBpm(metadata.t, 1, 1, 0);
    parseMusicBody(input_ksh_split_dash.slice(1));

    var output = outputSheet();
    return output;
}