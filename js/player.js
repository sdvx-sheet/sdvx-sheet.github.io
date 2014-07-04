bpm = 0;
snd = null;
// context = new AudioContext();
context = null;
startOffset = 0;
startTime = 0;
source = null;
request = null;

gain_node = null;

speed = 1.0;
currentTime = 0;
music_speed = 1.0;

bpm_list = [];

mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x

finish_c = 0;

sheet_string = "";

update_time_timer = null;

sheet_timeline = null;

updatingBPM = false;

tick_context = null;
tick_snd = null;

function getPosition(c) {
    return 510 - ((c / 48) * 500 / 4) * speed;
}

function getTimeByCAndBPM(c, current_bpm) {
    return (c / 48) * (60 / current_bpm) * 1000;
}

function getTimeByC(c) {
    // 從頭開始計算 bpm 所需時間
    var total_time = 0;
    for (var bpm_list_index in bpm_list) {
        bpm_list_index = parseInt(bpm_list_index, 10);
        var start_c = bpm_list[bpm_list_index][0];
        var next_bpm_element = bpm_list[bpm_list_index + 1];
        var end_c = (next_bpm_element == undefined) ? finish_c : next_bpm_element[0];
        var current_bpm = bpm_list[bpm_list_index][1];

        var c_through = end_c - start_c;

        // 將 c 轉換成時間
        var time_through = getTimeByCAndBPM(c_through, current_bpm);
        if (c_through >= c) {
            total_time += getTimeByCAndBPM(c, current_bpm);
            break;
        } else {
            total_time += time_through;
            c -= c_through;
        }
    }
    return total_time;
}

function getCByTime(time) {
    // 從頭開始計算 bpm 所需時間
    var total_c = 0;
    for (var bpm_list_index in bpm_list) {
        bpm_list_index = parseInt(bpm_list_index, 10);
        var start_c = bpm_list[bpm_list_index][0];
        var next_bpm_element = bpm_list[bpm_list_index + 1];
        var end_c = (next_bpm_element == undefined) ? finish_c : next_bpm_element[0];
        var current_bpm = bpm_list[bpm_list_index][1];

        var c_through = end_c - start_c;

        // 將 c 轉換成時間
        var time_through = getTimeByCAndBPM(c_through, current_bpm);
        if (time_through >= time) {
            total_c += time * (current_bpm / 60 / 1000) * 48;
            break;
        } else {
            total_c += c_through;
            time -= time_through;
        }
    }
    return total_c;
}

function updateBPMUI() {
    $("#bpm").val(bpm);
    $("#bpm_times_speed").val((bpm * speed).toFixed(4));
}

function getNotePos(note_pos) {
    return 53 + 50 * note_pos;
}

function getFXPos(note_pos) {
    return 53 + 100 * note_pos;
}

function addMeasurePolygon(svg, y) {
    var new_svg = svg.polygon([[50, y], [50, y - 6], [250, y - 6], [250, y]]);
    new_svg.setAttribute("class", "sheet_background_line");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function addTickSoundByTime(time) {
    window.sheet_timeline.add(playTickSound, time / 1000 / music_speed);
}

function addNote(svg, note_pos, c) {
    var x_left = getNotePos(note_pos);
    var y = getPosition(c);
    var new_svg = svg.polygon([[x_left, y], [x_left, y - 6], [x_left + 44, y - 6], [x_left + 44, y]]);
    new_svg.setAttribute("class", "note");
    var time = getTimeByC(c);
    addTickSoundByTime(time);
}

function addNoteLong(svg, note_pos, c_start, c_end) {
    var x_left = getNotePos(note_pos);
    var y_start = getPosition(c_start);
    var y_end = getPosition(c_end);
    var new_svg = svg.polygon([[x_left, y_start], [x_left, y_end], [x_left + 44, y_end], [x_left + 44, y_start]]);
    new_svg.setAttribute("class", "note_long");
    var time = getTimeByC(c_start);
    addTickSoundByTime(time);
}

function addFX(svg, note_pos, c) {
    var x_left = getFXPos(note_pos);
    var y = getPosition(c);
    var new_svg = svg.polygon([[x_left, y], [x_left, y - 6], [x_left + 94, y - 6], [x_left + 94, y]]);
    new_svg.setAttribute("class", "fx");
    var time = getTimeByC(c);
    addTickSoundByTime(time);
}

function addFXLong(svg, note_pos, c_start, c_end) {
    var x_left = getFXPos(note_pos);
    var y_start = getPosition(c_start);
    var y_end = getPosition(c_end);
    var new_svg = svg.polygon([[x_left, y_start], [x_left, y_end], [x_left + 94, y_end], [x_left + 94, y_start]]);
    new_svg.setAttribute("class", "fx_long");
    var time = getTimeByC(c_start);
    addTickSoundByTime(time);
}

function addOrthogonal(svg, note_pos, x_start, x_end, c) {
    var y = getPosition(c);
    var new_svg = svg.polygon([[x_start, y], [x_start, y - 15], [x_end + 50, y - 15], [x_end + 50, y]]);
    if (note_pos == 0)
        new_svg.setAttribute("class", "analog_blue");
    else
        new_svg.setAttribute("class", "analog_red");
}

function addPath(svg, note_pos, x_start, x_end, c_start, c_end) {
    var y_start = getPosition(c_start);
    var y_end = getPosition(c_end);
    var new_svg = svg.polygon([[x_start, y_start], [x_start + 50, y_start], [x_end + 50, y_end], [x_end, y_end]]);
    if (note_pos == 0)
        new_svg.setAttribute("class", "analog_blue moving");
    else
        new_svg.setAttribute("class", "analog_red moving");
}

function addAllMeasurePolygon(svg, total_beats) {
    for (var i = 0; i <= total_beats; ++i) {
        addMeasurePolygon(svg, getPosition(48 * i));
    }
}

function updateSheetByTime(g_sheet_element, time) {
    window.sheet_timeline.seek(time / 1000 / music_speed);

    var c = getCByTime(time);
    for (var bpm_list_index in bpm_list) {
        if (bpm_list[bpm_list_index][0] > c)
            break;
        bpm = bpm_list[bpm_list_index][1];
        updateBPMUI();
    }
}

function addBPM(svg, bpm, c) {
    if (bpm_list.length != 0) {
        var y = getPosition(c);
        var new_group = svg.group(null);
        $(new_group).svg();
        var new_group_svg = $(new_group).svg('get');
        var new_polygon = new_group_svg.polygon([[0, y], [0, y - 6], [300, y - 6], [300, y]]);
        var new_text = new_group_svg.text(null, 300, y, bpm.toString());
        $(new_text).addClass("bpm_text");
    }
    appendBPMList(c, bpm);
}

function appendBPMList(c, new_bpm) {
    bpm_list.push([c, new_bpm]);
}

function setFinishC(c) {
    window.finish_c = c;
}

function source_onended() {
    this.isPlaying = false;
    var time = (context.currentTime - startTime + startOffset) * music_speed;
    if (time >= snd.duration) {
        startOffset = (snd.duration - 0.1) / music_speed;
        $("#play").removeAttr("disabled");
        $("#load").removeAttr("disabled");
        $("#bpm_times_speed").removeAttr("disabled");
        $("#speed").removeAttr("disabled");
    }
}

function updateBPM(new_bpm, i) {
    if ($("#constant_bpm").prop("checked") == true && window.bpm != new_bpm) {
        stopping();
        var new_speed = (window.bpm * window.speed) / new_bpm;
        $("#speed").val(new_speed);
        window.speed = new_speed;
        // $("#time").val(+$("#time").val() + 0.1);
        $("#time").val(getTimeByC(bpm_list[i][0]) / 1000);
        window.startOffset = +$("#time").val();
        reloadSheet();
        playing();
    }

    window.bpm = new_bpm;
    updateBPMUI();
}

function appendTimeline(c, current_bpm, i) {
    var time = getTimeByCAndBPM(c, current_bpm) / 1000;
    window.sheet_timeline.to($("#g_sheet"), time / music_speed, {
        y: "+=" + (time / 60 * current_bpm * speed * 125).toString(), ease: Linear.easeNone, onStart: function () {
            if (updatingBPM == false) {
                updatingBPM = true;
                updateBPM(current_bpm, i);
                updatingBPM = false;
            }
        }
    });
}

function initialSheetTimeline() {
    for (var i in bpm_list) {
        i = parseInt(i);
        if (i == bpm_list.length - 1) {
            appendTimeline(window.finish_c - bpm_list[i][0], bpm_list[i][1], i);
        } else {
            appendTimeline(bpm_list[i + 1][0] - bpm_list[i][0], bpm_list[i][1], i);
        }
    }
}

function loading(event) {
    // disable wheel action
    $(window).off();
    // disable keyup action
    $(document).off();

    // set play unclickable
    $("#play").attr("disabled", "true");

    // get music name
    var music_title = $("#music").val();

    // get speed / currentTime from form
    speed = +$("#speed").val();
    currentTime = +$("#time").val();
    music_speed = +$("#music_speed").val();

    window.sheet_timeline = new TimelineLite({ paused: true });
    TweenLite.to($("#g_sheet"), 0, { y: 0, ease: Linear.easeNone });

    // initial svgs and reset global variables
    var svg_measure = $("#g_sheet_measure").svg('get');
    var svg_short = $("#g_sheet_short").svg('get');
    var svg_analog = $("#g_sheet_analog").svg('get');
    var svg_long = $("#g_sheet_long").svg('get');
    var svg_bpm = $("#g_bpm").svg('get');
    $("#g_sheet_measure").html("");
    $("#g_sheet_short").html("");
    $("#g_sheet_analog").html("");
    $("#g_sheet_long").html("");
    $("#g_bpm").html("");
    bpm_list = [];

    // load music
    var music_url = "sound/" + music_title + ".ogg";
    window.request = new XMLHttpRequest();
    window.request.onprogress = function (evt) {
        if (evt.lengthComputable) { //evt.loaded the bytes browser receive
            var percent_complete = (evt.loaded / evt.total) * 100;
            $("#load_progress").val(percent_complete.toFixed(1) + "%");
        }
    };
    window.request.open('GET', music_url, true);
    window.request.responseType = 'arraybuffer';
    window.request.onload = function () {
        window.context.decodeAudioData(window.request.response, function (buffer) {
            window.snd = buffer;
            window.startOffset = window.currentTime / window.music_speed;
            $("#play").removeAttr("disabled");
            $(window).one(mousewheelevt, mousewheelAction);
            $("#time_bar").attr("max", window.snd.duration);
            $("#time_bar").on("input", dragTimeBar);
            $("#time_bar").on("change", releaseTimeBar);
            $("#music_vol_bar").on("input", dragMusicVolBar);
            $(document).on('keyup', on_key_up);
        }, function () { });
    };
    window.request.send();

    jQuery.ajax({
        url: "sheet/" + music_title + ".js",
        dataType: 'script',
        success: function (data) {
            // initialSheetTimeline();
            window.sheet_string = data;
            $("#speed").removeAttr("disabled");
            $("#bpm_times_speed").removeAttr("disabled");
            updateSheetByTime($("#g_sheet")[0], currentTime * 1000);
        },
        async: true
    });
}

function dragTimeBar(e) {
    var is_playing = (window.source == null) ? false : window.source.isPlaying;
    if (is_playing)
        stopping();
    // startOffset = +$("#time_bar").val() / music_speed;
    var time_offset = +$("#time_bar").val() / music_speed;
    $("#time").val($("#time_bar").val());
    updateSheetByTime($("#g_sheet")[0], ((time_offset * music_speed) % snd.duration) * 1000);
}

function releaseTimeBar(e) {
    window.startOffset = +$("#time").val() / music_speed;
    updateSheetByTime($("#g_sheet")[0], ((window.startOffset * music_speed) % snd.duration) * 1000);
}

function mousewheelAction(e) {
    var evt = window.event || e; //equalize event object
    var delta = evt.originalEvent ? evt.originalEvent.detail * (-120) : evt.wheelDelta; //delta returns +120 when wheel is scrolled up, -120 when scrolled down
    var is_playing;

    is_playing = (source == null) ? false : source.isPlaying;
    // is_playing = (source == null) ? false : source.isPlaying;
    stopping();
    window.startOffset = window.startOffset - delta / 1000;
    updateSheetByTime($("#g_sheet")[0], ((window.startOffset * music_speed) % snd.duration) * 1000);
    $("#time").val(((window.startOffset * music_speed) % snd.duration).toFixed(4));
    $("#time_bar").val(window.startOffset);
    if (is_playing) {
        playing();
    }
    $(window).one(mousewheelevt, mousewheelAction);
}

function copying(event) {
    var text = location.protocol + '//' + location.host + location.pathname + "?music=" + $("#music").val() + "&speed=" + $("#speed").val() + "&time=" + $("#time").val();
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function select_song(event) {
    if (request) request.abort();
    if (source != null)
        stopping();
    $("#play").attr("disabled", "true");
    $("#stop").attr("disabled", "true");
    $("#load").removeAttr("disabled");
    $("#bpm_times_speed").attr("disabled", "true");
    $("#speed").attr("disabled", "true");
    $("#time").val("0");
    $("#time_bar").val("0.0");
}

function change_color() {
    // change analog color
    var red_color = $("#red_color").val();
    var blue_color = $("#blue_color").val();
    $(".analog_red").css({ fill: red_color });
    $(".analog_blue").css({ fill: blue_color });
}

function on_key_up(e) {
    if (e.keyCode == 32) {
        var is_playing = (window.source == null) ? false : window.source.isPlaying;
        if (is_playing) {
            console.log("key_up stopping");
            stopping();
        } else {
            playing();
        }
    }
}

function reloadSheet() {
    window.sheet_timeline = new window.TimelineLite({ paused: true });
    window.TweenLite.to($("#g_sheet"), 0, { y: 0, ease: window.Linear.easeNone });
    $("#g_sheet_measure").html("");
    $("#g_sheet_short").html("");
    $("#g_sheet_analog").html("");
    $("#g_sheet_long").html("");
    $("#g_bpm").html("");
    window.bpm_list = [];
    var c_time = +$("#time").val();
    eval(sheet_string);
    // initialSheetTimeline();
    // updateSheetByTime($("#g_sheet")[0], c_time * 1000);
    updateSheetByTime($("#g_sheet")[0], ((startOffset * music_speed) % snd.duration) * 1000);
}

function userUpdateBPMTimeSpeed(e) {
    window.speed = +$("#bpm_times_speed").val() / window.bpm;
    $("#speed").val(window.speed);
    reloadSheet();
}

function userUpdateSpeed(e) {
    window.speed = +$("#speed").val();
    $("#bpm_times_speed").val(window.speed * window.bpm);
    reloadSheet();
}

function sheetStyleChange(e) {
    if ($("#sdvx_style").prop("checked") == true) {
        $("#player_svg").addClass("sdvx_style_svg");
    } else {
        $("#player_svg").removeClass("sdvx_style_svg");
    }
}

function searching(e) {
    window.open("search.html", "SDVX 譜面搜尋", "toolbar=0, width=800, height=600");
}

var domActions = {
    initDomEvent: function (e) {
        $("#search").on("click", searching);
        $("#load").on("click", loading);
        $("#play").on("click", playing);
        $("#stop").on("click", stopping);
        $("#copy").on("click", copying);

        $("#music").on("change", select_song);

        $("#bpm_times_speed").on("change", userUpdateBPMTimeSpeed);
        $("#speed").on("change", userUpdateSpeed);

        $("#sdvx_style").on("change", sheetStyleChange);
    }
};

function loadTickSound() {
    var music_url = "sound/tick.wav";
    var req = new XMLHttpRequest();
    req.open('GET', music_url, true);
    req.responseType = 'arraybuffer';
    req.onload = function () {
        window.tick_context.decodeAudioData(req.response, function (buffer) {
            window.tick_snd = buffer;
        }, function () { });
    };
    req.send();
}

function playTickSound() {
    var tick_source = window.tick_context.createBufferSource();
    tick_source.buffer = window.tick_snd;
    tick_source.loop = false;
    var tick_gain_node = window.tick_context.createGain();
    tick_gain_node.gain.value = +$("#tick_vol_bar").val() / 100;
    tick_source.connect(tick_gain_node);
    tick_gain_node.connect(window.tick_context.destination);
    // tick_source.connect(window.tick_context.destination);
    tick_source.start(0, 0);
}

$(document).ready(function () {
    window.domActions.initDomEvent();

    initialMusicDBDOM();

    $("#play").attr("disabled", "true");
    $("#stop").attr("disabled", "true");
    $("#load").removeAttr("disabled");


    $("#g_sheet").svg();
    $("#g_bpm").svg();
    $("#g_sheet_measure").svg();
    $("#g_sheet_long").svg();
    $("#g_sheet_analog").svg();
    $("#g_sheet_short").svg();

    svg_measure = $("#g_sheet_measure").svg('get');
    svg_short = $("#g_sheet_short").svg('get');
    svg_analog = $("#g_sheet_analog").svg('get');
    svg_long = $("#g_sheet_long").svg('get');
    svg_bpm = $("#g_bpm").svg('get');

    // load data from url
    var url_speed = $.url().param("speed");
    if (url_speed != undefined)
        $("#speed").val(url_speed);
    var url_time = $.url().param("time");
    if (url_time != undefined) {
        $("#time").val(url_time);
        $("#time_bar").val(url_time);
    }
    var url_song = $.url().param("music");
    if (url_song != undefined)
        $("#music").val(url_song);

    // Web Audio API
    var audio_context = window.AudioContext || window.webkitAudioContext;
    window.context = new audio_context();
    window.tick_context = new audio_context();

    loadTickSound();

    TweenLite.lagSmoothing(0);
    // TweenLite.ticker.useRAF(false);

    $("#tick_sound_file").on("change", function(e) {
        var reader = new FileReader();
        reader.onload = function(e) {
            initTickSound(e.target.result);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    });
});

function initTickSound(array_buffer) {
    window.tick_context.decodeAudioData(array_buffer, function(buffer) {
        window.tick_snd = buffer;
    }, function(e) { console.log("Error decoding", e); });
}


function moving() {
    window.sheet_timeline.play();
}

function stopping(event) {
    window.currentTime = context.currentTime;
    $(".bpm").stop();
    // $("#g_sheet").stop();
    window.sheet_timeline.pause();

    var is_playing = (source == null) ? false : source.isPlaying;

    if (is_playing) {
        source.isPlaying = false;
        source.stop();
        window.startOffset += window.currentTime - startTime;
        $("#time").val(window.startOffset);
    }

    $("#play").removeAttr("disabled");
    $("#load").removeAttr("disabled");
    $("#bpm_times_speed").removeAttr("disabled");
    $("#speed").removeAttr("disabled");

    $("#time").val(((window.startOffset * music_speed) % snd.duration).toFixed(4));
}

function dragMusicVolBar(e) {
    var vol = +$("#music_vol_bar").val();
    window.gain_node.gain.value = vol / 100;
}

function playing(event) {
    window.startTime = context.currentTime;
    if (window.source != null)
        window.source.stop();
    window.source = context.createBufferSource();
    window.source.buffer = snd;
    window.source.loop = false;
    window.gain_node = context.createGain();
    window.source.connect(window.gain_node);
    window.gain_node.connect(context.destination);
    // window.source.connect(context.destination);
    window.source.isPlaying = true;
    window.source.onended = source_onended;
    window.source.playbackRate.value = music_speed;
    dragMusicVolBar();
    window.source.start(0, ((startOffset * music_speed + (+$("#shift").val())) % snd.duration));

    moving();

    $("#play").attr("disabled", "true");
    $("#load").attr("disabled", "true");
    $("#bpm_times_speed").attr("disabled", "true");
    $("#speed").attr("disabled", "true");
    $("#stop").removeAttr("disabled");

    if (window.update_time_timer != null)
        clearTimeout(window.update_time_timer);
    update_time();
}

function update_time(event) {
    if (source.isPlaying == true) {
        var time = ((((context.currentTime - startTime + startOffset) * music_speed) % snd.duration)).toFixed(4);
        $("#time").val(time);
        $("#time_bar").val(time);
        window.update_time_timer = setTimeout(update_time, 1000 / 10);
    }
}