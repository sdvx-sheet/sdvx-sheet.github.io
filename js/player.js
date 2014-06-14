bpm = 0;
snd = null;
context = null;
startOffset = 0;
startTime = 0;
source = null;

speed = 1.0;
currentTime = 0;

bpm_list = [];



finish_c = 48 * 4 * 90;

function getTimeByDist(dist) {
    return 60 / bpm * 4 * 1000 / 500 * dist / speed;
}

function getDistByTime(time) {
    // return time * speed * 500 / 1000 / 4 * bpm / 60;
    return 510 - getPosition(getCByTime(time));
}

function getTimeByCAndBPM(c, current_bpm) {
    return (c / 48) * (60 / current_bpm) * 1000;
}

function getCByTime(time) {
    // 從頭開始計算 bpm 所需時間
    var total_c = 0;
    for (var bpm_list_index in bpm_list)
    {
        bpm_list_index = parseInt(bpm_list_index, 10);
        var start_c = bpm_list[bpm_list_index][0];
        var next_bpm_element = bpm_list[bpm_list_index + 1];
        var end_c = (next_bpm_element == undefined) ? finish_c : next_bpm_element[0];
        var current_bpm = bpm_list[bpm_list_index][1];

        var c_through = end_c - start_c;

        // 將 c 轉換成時間
        var time_through = getTimeByCAndBPM(c_through, current_bpm);
        if (time_through >= time)
        {
            total_c += time * (current_bpm / 60 / 1000) * 48;
            break;
        }
        else
        {
            total_c += c_through;
            time -= time_through;
        }
    }
    return total_c;
}

function moving_sheet() {
    var current_sheet = $("#g_sheet")[0];
    var original_y = current_sheet.getBBox().y;
    var current_y = original_y + current_sheet.getCTM().f;
    var dist = 506 - current_y;
    var time = getTimeByDist(dist);
    var goal = 506 - original_y;
    $("#g_sheet").animate({ svgTransform: 'translate(0 ' + goal + ')' }, time, "linear");
}

function moving_bpm() {
    if ($(".bpm.moving").hasClass("moving")) {
        $(".bpm.moving").each(function (index) {
            var current_sheet = this;
            var original_y = current_sheet.getBBox().y;
            var current_y = original_y + current_sheet.getCTM().f;
            var dist = 506 - current_y;
            var time = getTimeByDist(dist);
            var goal = 506 - original_y;
            $(this).animate({ svgTransform: 'translate(0 ' + goal + ')' }, time, "linear", function () {
                var new_bpm = $(this).data("bpm");
                // $(this).removeClass("bpm");
                $(this).removeClass("moving");
                updateBPM(new_bpm);
            });
        });
    }
}

function moving() {
    moving_bpm();
    moving_sheet();
}

function stopping(event) {
    $(".bpm").stop();
    $("#g_sheet").stop();

    // snd.pause();
    if (source.playbackState == source.PLAYING_STATE) {
        source.stop();
        startOffset += context.currentTime - startTime;
    }

    $("#play").removeAttr("disabled");
    $("#load").removeAttr("disabled");
}

function playing(event) {
    // snd.play();
    startTime = context.currentTime;
    source = context.createBufferSource();
    source.buffer = snd;
    source.loop = false;
    source.connect(context.destination);
    source.start(0, startOffset % snd.duration);

    moving();
    $("#play").attr("disabled", "true");
    $("#load").attr("disabled", "true");
    $("#stop").removeAttr("disabled");

    update_time();
}

function updateBPM(new_bpm) {
    stopping();
    bpm = new_bpm;
    playing();
}

function getPosition(c) {
    return 510 - ((c / 48) * 500 / 4) * speed;
}

function addMeasurePolygon(svg, y) {
    var new_svg = svg.polygon([[50, y], [50, y - 6], [250, y - 6], [250, y]]);
    new_svg.setAttribute("class", "sheet_background_line moving");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function getNotePos(note_pos)
{
    return 53 + 50 * note_pos;
}

function addNote(svg, note_pos, y)
{
    var x_left = getNotePos(note_pos);
    var new_svg = svg.polygon([[x_left, y], [x_left, y - 6], [x_left + 44, y - 6], [x_left + 44, y]]);
    new_svg.setAttribute("class", "note moving");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function addNoteLong(svg, note_pos, y_start, y_end)
{
    var x_left = getNotePos(note_pos);
    var new_svg = svg.polygon([[x_left, y_start], [x_left, y_end], [x_left + 44, y_end], [x_left + 44, y_start]]);
    new_svg.setAttribute("class", "note_long moving");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function getFXPos(note_pos)
{
    return 53 + 100 * note_pos;
}

function addFX(svg, note_pos, y) {
    var x_left = getFXPos(note_pos);
    var new_svg = svg.polygon([[x_left, y], [x_left, y - 6], [x_left + 94, y - 6], [x_left + 94, y]]);
    new_svg.setAttribute("class", "fx moving");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function addFXLong(svg, note_pos, y_start, y_end)
{
    var x_left = getFXPos(note_pos);
    var new_svg = svg.polygon([[x_left, y_start], [x_left, y_end], [x_left + 94, y_end], [x_left + 94, y_start]]);
    new_svg.setAttribute("class", "fx_long moving");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function addOrthogonal(svg, note_pos, x_start, x_end, y)
{
    var new_svg = svg.polygon([[x_start, y], [x_start, y - 15], [x_end + 50, y - 15], [x_end + 50, y]]);
    if (note_pos == 0)
        new_svg.setAttribute("class", "analog_blue moving");
    else
        new_svg.setAttribute("class", "analog_red moving");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function addPath(svg, note_pos, x_start, x_end, y_start, y_end)
{
    var new_svg = svg.polygon([[x_start, y_start], [x_start + 50, y_start], [x_end + 50, y_end], [x_end, y_end]]);
    if (note_pos == 0)
        new_svg.setAttribute("class", "analog_blue moving");
    else
        new_svg.setAttribute("class", "analog_red moving");
    new_svg.setAttribute("transform", "translate(0,0)");
}

function addAllMeasurePolygon(svg, total_beats)
{
    for (var i = 0; i <= total_beats; ++i)
    {
        addMeasurePolygon(svg, getPosition(48 * i));
    }
}

function updateSheetByTime(g_sheet_element, time)
{
    var dist = getDistByTime(time);
    g_sheet_element.setAttribute("transform", "translate(0," + dist + ")");

    // update BPM time
    $(".bpm").each(function () {
        this.setAttribute("transform", "translate(0," + dist + ")");
        var original_y = this.getBBox().y;
        var current_y = original_y + dist;
        var goal = 506 - original_y;
        if (dist > goal) $(this).removeClass("moving");
        else $(this).addClass("moving");
    });

    var c = getCByTime(time);
    for(var bpm_list_index in bpm_list)
    {
        if (bpm_list[bpm_list_index][0] > c)
            break;
        bpm = bpm_list[bpm_list_index][1];
    }
}

function addBPM(svg, bpm, c)
{
    if (bpm_list.length != 0) {
        var y = getPosition(c);
        var new_svg = svg.polygon([[0, y], [0, y - 6], [300, y - 6], [300, y]]);
        new_svg.setAttribute("class", "bpm moving");
        new_svg.setAttribute("transform", "translate(0,0)");
        new_svg.setAttribute("data-bpm", bpm);
    }
    appendBPMList(c, bpm);
}

function appendBPMList(c, new_bpm)
{
    bpm_list.push([c, new_bpm]);
}

function setFinishC(c)
{
    finish_c = c;
}

function loading(event) {
    // set play unclickable
    $("#play").attr("disabled", "true");

    // get music name
    var music_title = $("#music").val();

    // get speed / currentTime from form
    speed = +$("#speed").val();
    currentTime = +$("#time").val();

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
    var request = new XMLHttpRequest();
    request.onprogress = function (evt) {
        if (evt.lengthComputable) {  //evt.loaded the bytes browser receive
            //evt.total the total bytes seted by the header
            var percentComplete = (evt.loaded / evt.total) * 100;
            $("#load_progress").val(percentComplete.toFixed(4) + "%");
            // console.log(percentComplete);
        }
    };
    request.open('GET', music_url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            snd = buffer;
            startOffset = currentTime;
            $("#play").removeAttr("disabled");
        }, null);
    }
    request.send();

    jQuery.ajax({
        url: "sheet/" + music_title + ".js",
        dataType: 'script',
        success: function () {
            updateSheetByTime($("#g_sheet")[0], currentTime * 1000);
        },
        async: true
    });

    

    $(window).one('mousewheel', mousewheelAction);
}

function mousewheelAction(e) {
    if (e.originalEvent.wheelDelta > 0) {
        // console.log(e.originalEvent.wheelDelta);
        // Mouse Wheel Up, time--
        var is_playing = (source.playbackState == source.PLAYING_STATE);
        stopping();
        startOffset = startOffset - e.originalEvent.wheelDelta / 1000;
        // if (startOffset > snd.duration) startOffset = snd.duration;
        updateSheetByTime($("#g_sheet")[0], (startOffset % snd.duration) * 1000);
        // snd.currentTime = snd.currentTime - e.originalEvent.wheelDelta / 1000;
        // updateSheetByTime($("#g_sheet")[0], snd.currentTime * 1000);
        if (is_playing)
            playing();
    }
    else {
        // console.log(e.originalEvent.wheelDelta);
        // Mouse Wheel Down, time++
        var is_playing = (source.playbackState == source.PLAYING_STATE);
        stopping();
        startOffset = startOffset - e.originalEvent.wheelDelta / 1000;
        // if (startOffset > snd.duration) startOffset = snd.duration;
        updateSheetByTime($("#g_sheet")[0], (startOffset % snd.duration) * 1000);
        if (is_playing)
            playing();
    }
    $(window).one('mousewheel', mousewheelAction);
}

function update_time(event) {
    if (source.playbackState == source.PLAYING_STATE)
        $("#time").val(((context.currentTime - startTime + startOffset) % snd.duration).toFixed(4));
    setTimeout(update_time, 1000 / 60);
}

function copying(event) {
    var text = location.protocol + '//' + location.host + location.pathname + "?music=" + $("#music").val() + "&speed=" + $("#speed").val() + "&time=" + $("#time").val();
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function select_song(event) {
    $("#play").attr("disabled", "true");
    $("#stop").attr("disabled", "true");
    $("#load").removeAttr("disabled");
    $("#time").val("0");
}

$(document).ready(function () {
    jQuery.fx.interval = 1;

	$("#load").on("click", loading);
	$("#play").on("click", playing);
	$("#stop").on("click", stopping);
	$("#copy").on("click", copying);

	$("#music").on("change", select_song);

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
    if (url_time != undefined)
        $("#time").val(url_time);
    var url_song = $.url().param("music");
    if (url_song != undefined)
        $("#music").val(url_song);

    // Web Audio API
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
});