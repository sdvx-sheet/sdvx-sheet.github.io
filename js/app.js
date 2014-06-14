function showErrorMsg(element) {
    element.stop().css({ "display": "block", "opacity": "0" }).animate({ "opacity": "1" });
}
function hideErrorMsg(element) {
    element.stop().css({ "display": "none" });
}

var fetching_tab_info = null;

function get_clear_type (type_int)
{
    switch (type_int) {
        case "1":
            return "Crash";
        case "2":
            return "C";
        case "3":
            return "UC";
        case "4":
            return "PUC";
        case "5":
            return "HC";
        default:
            return "";
            break;
    }
}
function get_score_grade (grade_int)
{
    switch (grade_int) {
        case "1":
            return "D";
        case "2":
            return "C";
        case "3":
            return "B";
        case "4":
            return "A";
        case "5":
            return "AA";
        case "6":
            return "AAA";
        default:
            return "";
    }
}

function playerInfoAction() {
    if (fetching_tab_info)
        fetching_tab_info.abort();

    fetching_tab_info = $.ajax("http://140.113.216.178/sdvx/fetch_player_info.php", {
        dataType: "jsonp",
        success: function (json) {
            var html_value = "<table><tr><td>Player Name:</td><td>" + json.name + "</td></tr><tr><td>Play Count:</td><td>" + json.play_count + "</td></tr><tr><td>Skill Name ID:</td><td>" + json.skill_name_id + "</td></tr></table>";
            $(".sdvx_info").slideUp();
            $("#player_info_page").stop().slideUp().html(html_value).slideDown();
            fetching_tab_info = null;
        }
    });
}

function liveMusicDataAction() {
    if (fetching_tab_info)
        fetching_tab_info.abort();

    fetching_tab_info = $.ajax("http://140.113.216.178/sdvx/fetch_live_music_data.php", {
        dataType: "jsonp",
        success: function (json) {
            var html_value = "<table class='live_music_data_table'>";
            // 加入標題欄位
            html_value += "<tr><th>時間</th><th>卡名</th><th>曲名</th><th>難度</th><th>等級</th><th>Clear Type</th><th>Grade</th><th>分數</th><th>Max Chain</th><th>Critical</th><th>Near</th><th>Error</th><th>Effective Rate</th><th colspan='7'>Before < 準度 > After</th></tr>";
            for (var i in json) {
                html_value += "<tr>";
                html_value += "<td>" + json[i]["time"] + "</td>";
                html_value += "<td>" + json[i]["name"] + "</td>";
                html_value += "<td>" + json[i]["title_name"] + "</td>";
                switch (json[i]["music_type"]) {
                    case "0":
                        html_value += "<td>NOV</td>";
                        break;
                    case "1":
                        html_value += "<td>ADV</td>";
                        break;
                    case "2":
                        html_value += "<td>EXH</td>";
                        break;
                    case "3":
                        html_value += "<td>INF</td>";
                        break;
                }
                html_value += "<td>" + json[i]["difnum"] + "</td>";
                html_value += "<td>" + get_clear_type(json[i]["clear_type"]) + "</td>";
                html_value += "<td>" + get_score_grade(json[i]["score_grade"]) + "</td>";
                html_value += "<td>" + json[i]["score"] + "</td>";
                html_value += "<td>" + json[i]["max_chain"] + "</td>";
                html_value += "<td>" + json[i]["critical"] + "</td>";
                html_value += "<td>" + json[i]["near"] + "</td>";
                html_value += "<td>" + json[i]["error"] + "</td>";
                html_value += "<td>" + json[i]["effective_rate"] + "</td>";
                html_value += "<td>" + json[i]["before_3"] + "</td>";
                html_value += "<td>" + json[i]["before_2"] + "</td>";
                html_value += "<td>" + json[i]["before_1"] + "</td>";
                html_value += "<td>" + json[i]["just"] + "</td>";
                html_value += "<td>" + json[i]["after_1"] + "</td>";
                html_value += "<td>" + json[i]["after_2"] + "</td>";
                html_value += "<td>" + json[i]["after_3"] + "</td>";
                // " + json[i]["before_2"] + " " + json[i]["before_1"] + " " + json[i]["just"] + " " + json[i]["after_1"] + " " + json[i]["after_2"] + " " + json[i]["after_3"] + "</td>";
                html_value += "</tr>";
            }
            html_value += "</table>";
            $(".sdvx_info").stop().slideUp();
            $("#live_music_data_page").stop().slideUp().html(html_value).css("height", "auto");
            $(".live_music_data_table").find("tr:even").addClass("even_tr");
            $("#live_music_data_page").slideDown();

            fetching_tab_info = null;
        }
    });
}

function mi_detailClickHandler(event) {
    if (fetching_tab_info)
        fetching_tab_info.abort();

    // 先把其他 Detail 的 tr 拿掉
    $(".mi_detail_div").slideUp('default', function () {
        $(this).closest("tr").remove();
    });

    // 在下方欄新增一個 tr & div
    $(this).closest("tr").after("<tr class='mi_detail_tr'></tr>").next().append("<td colspan='9'></td>").find("td").append("<div class='mi_detail_div invisible new_detail'></div>");

    // 取得 music_id 和 music_type
    var music_id = $(this).closest("tr").data("music_id");
    var music_type = $(this).closest("tr").data("music_type");

    // 查詢資料
    fetching_tab_info = $.ajax("http://140.113.216.178/sdvx/fetch_music_detail.php", {
        data: {
            "music_id": music_id,
            "music_type": music_type
        },
        dataType: "jsonp",
        success: function (json) {
            var html_value = "<table class='music_info_detail'>";
            // 加入標題欄位
            html_value += "<tr><th>時間</th><th>Clear Type</th><th>Grade</th><th>分數</th><th>Max Chain</th><th>Critical</th><th>Near</th><th>Error</th><th>Effective Rate</th><th colspan='7'>Before < 準度 > After</tr>"
            for (var i in json) {
                html_value += "<tr>";
                html_value += "<td>" + json[i]["time"] + "</td>";
                html_value += "<td>" + get_clear_type(json[i]["clear_type"]) + "</td>";
                html_value += "<td>" + get_score_grade(json[i]["score_grade"]) + "</td>";
                html_value += "<td>" + json[i]["score"] + "</td>";
                html_value += "<td>" + json[i]["max_chain"] + "</td>";
                html_value += "<td>" + json[i]["critical"] + "</td>";
                html_value += "<td>" + json[i]["near"] + "</td>";
                html_value += "<td>" + json[i]["error"] + "</td>";
                html_value += "<td>" + json[i]["effective_rate"] + "</td>";
                html_value += "<td>" + json[i]["before_3"] + "</td>";
                html_value += "<td>" + json[i]["before_2"] + "</td>";
                html_value += "<td>" + json[i]["before_1"] + "</td>";
                html_value += "<td>" + json[i]["just"] + "</td>";
                html_value += "<td>" + json[i]["after_1"] + "</td>";
                html_value += "<td>" + json[i]["after_2"] + "</td>";
                html_value += "<td>" + json[i]["after_3"] + "</td>";
                // " + json[i]["before_2"] + " " + json[i]["before_1"] + " " + json[i]["just"] + " " + json[i]["after_1"] + " " + json[i]["after_2"] + " " + json[i]["after_3"] + "</td>";
                html_value += "</tr>";
            }
            html_value += "</table>";

            $(".mi_detail_div.new_detail").html(html_value);
            $(".mi_detail_div.new_detail").removeClass("new_detail");
            $(".music_info_detail").find("tr:even").addClass("even_tr_2");
            $(".mi_detail_div").slideDown();

            fetching_tab_info = null;
        }
    });
}

function musicInfoAction() {
    if (fetching_tab_info)
        fetching_tab_info.abort();

    fetching_tab_info = $.ajax("http://140.113.216.178/sdvx/fetch_music_info.php", {
        data: {
            "order_by": "last_played_time",
            "title": "",
            "nov": 1,
            "adv": 1,
            "exh": 1,
            "inf": 1,
            "np": 1,
            "crash": 1,
            "clear": 1,
            "hc": 1,
            "uc": 1,
            "puc": 1,
            "d": 1,
            "c": 1,
            "b": 1,
            "a": 1,
            "aa": 1,
            "aaa": 1,
            "dif_min": 1,
            "dif_max": 16,
            "limit_start": 0,
            "limit_num": 50
        },
        dataType: "jsonp",
        success: function (json) {
            var html_value = "<table class='music_info_table'>";
            // 加入標題欄位
            // html_value += "<tr><th>時間</th><th>卡名</th><th>曲名</th><th>難度</th><th>等級</th><th>分數</th><th>Max Chain</th><th>Critical</th><th>Near</th><th>Error</th><th>Effective Rate</th><th colspan='7'>Before < 準度 > After</th></tr>";
            html_value += "<tr><th>曲名</th><th>難度</th><th>等級</th><th>最高分</th><th>Clear</th><th>Grade</th><th>Play Count</th><th>最終 Play 時間</th><th>詳細資料</th></tr>"
            for (var i in json) {
                html_value += "<tr data-music_type='" + json[i]["type"] + "' data-music_id='" + json[i]["music_id"] + "'>";

                html_value += "<td>" + json[i]["title_name"] + "</td>";
                switch (json[i]["type"]) {
                    case "0":
                        html_value += "<td>NOV</td>";
                        break;
                    case "1":
                        html_value += "<td>ADV</td>";
                        break;
                    case "2":
                        html_value += "<td>EXH</td>";
                        break;
                    case "3":
                        html_value += "<td>INF</td>";
                        break;
                }
                html_value += "<td>" + json[i]["difnum"] + "</td>";
                html_value += "<td>" + (json[i]["score"] == null ? 0 : json[i]["score"]) + "</td>";
                html_value += "<td>" + get_clear_type(json[i]["clear_type"]) + "</td>";
                html_value += "<td>" + get_score_grade(json[i]["score_grade"]) + "</td>";
                html_value += "<td>" + json[i]["play_count"] + "</td>";
                html_value += "<td>" + (json[i]["last_played_time"] == null ? "" : json[i]["last_played_time"]) + "</td>";
                html_value += "<td class='mi_detail'>Detail ↓</td>";

                html_value += "</tr>";
            }
            html_value += "</table>";
            $(".sdvx_info").stop().slideUp();
            $("#music_info_page").stop().slideUp('default', function () {
                $("#mi_info").html(html_value);
                $("#music_info_page").css("height", "auto");
                $("#music_info_page").slideDown();
                $(".music_info_table").find("tr:even").addClass("even_tr");
                $(".mi_detail").on("click", mi_detailClickHandler);
            });
            // $("#mi_info").slideUp().html(html_value).slideDown();
            fetching_tab_info = null;
        }
    });
}

function logoutHandler(event) {
    $.ajax("http://140.113.216.178/sdvx/logout.php", {
        dataType: "jsonp",
        success: function (json) {
            $(".sdvx_info").slideUp();
            $("#sdvx_tabs").slideUp();
            $("#logout_div").slideUp();
            $("#login_information").slideUp('defaut', function () { $("#login_form").slideDown(); });
        }
    });
}

function loginSuccessHandler(json) {
    if (json.errorCode == 0) { // 成功登入
        // 把登入介面拿掉，產生 Tabs
        $("#login_information").slideUp();
        $("#login_form").slideUp('default', function () { $("#login_information").html(json.msg).slideDown(); $("#sdvx_tabs").slideDown(); $("#logout_div").slideDown(); playerInfoAction(); });
        $("#sdvx_tabs").find(".tab").removeClass("tab_selected");
        $("#tab_pi").addClass("tab_selected");
        $("#logout").on("click", logoutHandler);
        // 設定好 tab 按下的 click event
    }
    else
    {
        $("#login_information").html(json.msg);
    }
}

function loginClickHandler(event) {
    event.stopPropagation();
    var error = false;
    var account = $("#account").val();
    var password = $("#password").val();
    var error_msg_account = $("#account").closest("tr").find(".error_msg");
    var error_msg_password = $("#password").closest("tr").find(".error_msg");

    // check account
    if (account == "") {
        error_msg_account.text("*卡號不得為空");
        showErrorMsg(error_msg_account);
        error = true;
    }
    else
        hideErrorMsg(error_msg_account);

    // check password
    if (password == "") {
        error_msg_password.text("*密碼不得為空");
        showErrorMsg(error_msg_password);
        error = true;
    } else if (/^\d+$/.test(password) == false) {
        error_msg_password.text("*密碼必須是純數字");
        showErrorMsg(error_msg_password);
        error = true;
    } else if (password.length != 4) {
        error_msg_password.text("*密碼長度不正確");
        showErrorMsg(error_msg_password);
        error = true;
    } else
        hideErrorMsg(error_msg_password);

    // Use AJAX to check login information
    if (error == false) {
        $("#login_information").html("<p>登入中...</p>").slideDown('default', function () {
            $.ajax("http://140.113.216.178/sdvx/auth.php", {
                data: { "account": account, "password": password },
                dataType: "jsonp",
                success: loginSuccessHandler
            });
        });
    }
}

function tabClickHandler(event) {
    $("#sdvx_tabs").off();

    $("#sdvx_tabs").find(".tab").removeClass("tab_selected");
    $(this).addClass("tab_selected");

    $(".sdvx_info").slideUp('default');

    if ($(this).attr("id") == "tab_pi") {
        $("#player_info_page").stop().slideUp('default', function () {
            playerInfoAction();
            $("#sdvx_tabs").on('click', '.tab', tabClickHandler);
        });
    } else if ($(this).attr("id") == "tab_lmd") {
        $("#live_music_data_page").stop().slideUp('default', function () {
            liveMusicDataAction();
            $("#sdvx_tabs").on('click', '.tab', tabClickHandler);
        });
    } else if ($(this).attr("id") == "tab_mi") {
        $("#music_info_page").stop().slideUp('default', function () {
            $(".mi_tab").removeClass("tab_selected");
            $("#mi_filter_order_last").addClass("tab_selected");
            $(".mi_difnum_tab").addClass("tab_selected");
            $(".mi_played_tab").addClass("tab_selected");
            $(".mi_clear_tab").addClass("tab_selected");
            musicInfoAction();
            $("#sdvx_tabs").on('click', '.tab', tabClickHandler);
        });
    }
}

function musicInfoUpdate() {
    if (fetching_tab_info)
        fetching_tab_info.abort();

    order = $(".mi_tab.tab_selected").data("order");
    title = $("#mi_filter_title").val();
    nov = +$("#mi_filter_novice").hasClass("tab_selected");
    adv = +$("#mi_filter_advanced").hasClass("tab_selected");
    exh = +$("#mi_filter_exhaust").hasClass("tab_selected");
    inf = +$("#mi_filter_infinite").hasClass("tab_selected");

    np = +$("#mi_filter_np").hasClass("tab_selected");
    crash = +$("#mi_filter_crash").hasClass("tab_selected");
    clear = +$("#mi_filter_clear").hasClass("tab_selected");
    hc = +$("#mi_filter_hc").hasClass("tab_selected");
    uc = +$("#mi_filter_uc").hasClass("tab_selected");
    puc = +$("#mi_filter_puc").hasClass("tab_selected");

    d = +$("#mi_filter_d").hasClass("tab_selected");
    c = +$("#mi_filter_c").hasClass("tab_selected");
    b = +$("#mi_filter_b").hasClass("tab_selected");
    a = +$("#mi_filter_a").hasClass("tab_selected");
    aa = +$("#mi_filter_aa").hasClass("tab_selected");
    aaa = +$("#mi_filter_aaa").hasClass("tab_selected");

    dif_min = $("#mi_filter_difnum_min").val();
    dif_max = $("#mi_filter_difnum_max").val();

    limit_num = $("#mi_filter_limit_num").val();



    fetching_tab_info = $.ajax("http://140.113.216.178/sdvx/fetch_music_info.php", {
        data: {
            "order_by": order,
            "title": title,
            "nov": nov,
            "adv": adv,
            "exh": exh,
            "inf": inf,
            "np": np,
            "crash": crash,
            "clear": clear,
            "hc": hc,
            "uc": uc,
            "puc": puc,
            "d": d,
            "c": c,
            "b": b,
            "a": a,
            "aa": aa,
            "aaa": aaa,
            "dif_min": dif_min,
            "dif_max": dif_max,
            "limit_start": 0,
            "limit_num": limit_num
        },
        dataType: "jsonp",
        success: function (json) {
            var html_value = "<table class='music_info_table'>";
            // 加入標題欄位
            // html_value += "<tr><th>時間</th><th>卡名</th><th>曲名</th><th>難度</th><th>等級</th><th>分數</th><th>Max Chain</th><th>Critical</th><th>Near</th><th>Error</th><th>Effective Rate</th><th colspan='7'>Before < 準度 > After</th></tr>";
            html_value += "<tr><th>曲名</th><th>難度</th><th>等級</th><th>最高分</th><th>Clear</th><th>Grade</th><th>Play Count</th><th>最終 Play 時間</th><th>詳細資料</th></tr>"
            for (var i in json) {
                html_value += "<tr data-music_type='" + json[i]["type"] + "' data-music_id='" + json[i]["music_id"] + "'>";

                html_value += "<td>" + json[i]["title_name"] + "</td>";
                switch (json[i]["type"]) {
                    case "0":
                        html_value += "<td>NOV</td>";
                        break;
                    case "1":
                        html_value += "<td>ADV</td>";
                        break;
                    case "2":
                        html_value += "<td>EXH</td>";
                        break;
                    case "3":
                        html_value += "<td>INF</td>";
                        break;
                }
                html_value += "<td>" + json[i]["difnum"] + "</td>";
                html_value += "<td>" + (json[i]["score"] == null ? 0 : json[i]["score"]) + "</td>";
                html_value += "<td>" + get_clear_type(json[i]["clear_type"]) + "</td>";
                html_value += "<td>" + get_score_grade(json[i]["score_grade"]) + "</td>";
                html_value += "<td>" + json[i]["play_count"] + "</td>";
                html_value += "<td>" + (json[i]["last_played_time"] == null ? "" : json[i]["last_played_time"]) + "</td>";
                html_value += "<td class='mi_detail'>Detail ↓</td>";

                html_value += "</tr>";
            }
            html_value += "</table>";
            $("#mi_info").html(html_value).css("height", "auto").slideDown();
            $(".music_info_table").find("tr:even").addClass("even_tr");
            $(".mi_detail").on("click", mi_detailClickHandler);
            
            fetching_tab_info = null;
        }
    });
}

function mi_tabClickHandler(event) {
    $("#mi_filter").off();

    $("#mi_filter_order").find(".mi_tab").removeClass("tab_selected");
    $(this).addClass("tab_selected");

    $("#mi_info").slideUp("default", function () {
        musicInfoUpdate();
        $("#mi_filter").on('click', '.mi_tab', mi_tabClickHandler);
    });
}

function mi_filterClickHandler(event) {
    $("#mi_filter").off();

    $("#mi_info").slideUp("default", function () {
        musicInfoUpdate();
        $("#mi_filter").on('click', '.mi_tab', mi_tabClickHandler);
        $("#mi_filter_btn").on('click', mi_filterClickHandler);
    });
}

$(document).ready(function () {
    $("#login").on('click', loginClickHandler);
    $("#sdvx_tabs").on('click', '.tab', tabClickHandler);
    $("#mi_filter").on('click', '.mi_tab', mi_tabClickHandler);
    $("#mi_filter_btn").on('click', mi_filterClickHandler);
    $(".mi_difnum_tab").on('click', function () { $(this).toggleClass("tab_selected"); })
    $(".mi_played_tab").on('click', function () { $(this).toggleClass("tab_selected"); })
    $(".mi_clear_tab").on('click', function () { $(this).toggleClass("tab_selected"); })
});