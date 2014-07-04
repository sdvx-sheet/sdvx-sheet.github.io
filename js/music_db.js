// Create DB
var music_db = TAFFY([
    { value: "hanakagerou_e", title: "華陽炎-Hana Kagerou-", type: 3, level: 13 },
    { value: "lunatic_rough_party_e", title: "Lunatic Rough Party!!", type: 3, level: 13 },
    { value: "lostone_e", title: "ロストワンの号哭", type: 3, level: 13 },
    { value: "eight_e", title: "8 -eight-", type: 3, level: 14 },
    { value: "antinomie_e", title: "Antinomie (SDVX EDIT)", type: 3, level: 14 },
    { value: "bubble_raver_e", title: "BUBBLE RAVER", type: 3, level: 14 },
    { value: "cirno_break_e", title: "Cirno Break", type: 3, level: 14 },
    { value: "crazy_cinema_story_e", title: "crazy cinema story", type: 3, level: 14 },
    { value: "daily_lunch_special_deliciousremix_e", title: "Daily Lunch Special ～DeliciousREMIX～", type: 3, level: 14 },
    { value: "dawn_of_asia_e", title: "Dawn of Asia", type: 3, level: 14 },
    { value: "dirty_rouge_e", title: "- dirty rouge -", type: 3, level: 14 },
    { value: "double_universe_e", title: "Double Universe", type: 3, level: 14 },
    { value: "electric_sister_bitch_e", title: "ectric \"Sister\" Bitch", type: 3, level: 14 },
    { value: "engraved_mark_e", title: "Engraved Mark", type: 3, level: 14 },
    { value: "fairy_dancing_in_lake_e", title: "#Fairy_dancing_in_lake", type: 3, level: 14 },
    { value: "frantic_wolf_e", title: "Frantic Wolf", type: 3, level: 14 },
    { value: "gerol_e", title: "GEROL", type: 3, level: 14 },
    { value: "goodbyebye_planet_e", title: "Goodbye-bye Planet", type: 3, level: 14 },
    { value: "hoshizora_illumination_e", title: "Hoshizora Illumination", type: 3, level: 14 },
    { value: "im_so_happy_e", title: "I'm so Happy", type: 3, level: 14 },
    { value: "infinity_overdrive_e", title: "INFINITY OVERDRIVE", type: 3, level: 14 },
    { value: "last_battalion_e", title: "Last Battalion", type: 3, level: 14 },
    { value: "lemond_summer_e", title: "LEMON SUMMER", type: 3, level: 14 },
    { value: "lieselotte_e", title: "Lieselotte", type: 3, level: 14 },
    { value: "littlegamestar_e", title: "LittleGameStar", type: 3, level: 14 },
    { value: "mother_ship_e", title: "Mother Ship (C-YA MIX)", type: 3, level: 14 },
    { value: "next_infection_e", title: "Next infection", type: 3, level: 14 },
    { value: "odds_and_ends_e", title: "odds and ends", type: 3, level: 14 },
    { value: "overdrivers_e", title: "OVERDRIVERS", type: 3, level: 14 },
    { value: "over_the_starlit_sky_e", title: "Over the Starlit sky", type: 3, level: 14 },
    { value: "paradoxy_e", title: "Paradoxy", type: 3, level: 14 },
    { value: "playing_with_fire_e", title: "Playing With Fire", type: 3, level: 14 },
    { value: "profession_e", title: "Profession", type: 3, level: 14 },
    { value: "punisher_e", title: "PUNISHER", type: 3, level: 14 },
    { value: "reverse_limited_e", title: "REVERSE LIMITED!(SDVX Edit)", type: 3, level: 14 },
    { value: "rings_of_rainbow_e", title: "Rings of Rainbow", type: 3, level: 14 },
    { value: "sakura_reflection_plight_e", title: "Sakura Reflection (P*Light Slayer Remix)", type: 3, level: 14 },
    { value: "scapegoat_boy_e", title: "SCAPEGOAT BOY - SDVX Edit. -", type: 3, level: 14 },
    { value: "she_is_my_wife_e", title: "She is my wife すーぱーアイドル☆ミツル子Remixちゃん", type: 3, level: 14 },
    { value: "squeeze_e", title: "Squeeze", type: 3, level: 14 },
    { value: "stella_sinistra_e", title: "Stella Sinistra", type: 3, level: 14 },
    { value: "take_a_step_forward_e", title: "take a step forward", type: 3, level: 14 },
    { value: "tomato_leaf_breaks_e", title: "Tomato Leaf Breaks", type: 3, level: 14 },
    { value: "unicorn_tail_e", title: "Unicorn tail Dustboxxxx RMX", type: 3, level: 14 },
    { value: "venona_e", title: "Venona", type: 3, level: 14 },
    { value: "versus_e", title: "VERSUS!!", type: 3, level: 14 },
    { value: "vindicator_e", title: "Vindicator", type: 3, level: 14 },
    { value: "virtual_sunrise_e", title: "Virtual Sunrise", type: 3, level: 14 },
    { value: "voice2voice_e", title: "Voice 2 Voice", type: 3, level: 14 },
    { value: "wave_e", title: "WAVE", type: 3, level: 14 },
    { value: "we_are_the_scarlet_e", title: "We Are The Scarlet (SDVX Edit)", type: 3, level: 14 },
    { value: "anohanasakuya_e", title: "アノ華咲クヤ", type: 3, level: 14 },
    { value: "arusutoromeria_e", title: "アルストロメリア KURO-HACO Remix", type: 3, level: 14 },
    { value: "usatei_e", title: "ウサテイ", type: 3, level: 14 },
    { value: "ubaware_e", title: "ウバワレ", type: 3, level: 14 },
    { value: "oowarerayorokobisanubeshiomoyo_e", title: "おお われら喜び讃うべし、主よ", type: 3, level: 14 },
    { value: "kunoichidemokoigasitai_e", title: "クノイチでも恋がしたい", type: 3, level: 14 },
    { value: "gekiokosutikkufainariaritipunpunmasuta_supa_ku_e", title: "げきオコスティックファイナリアリティぷんぷんマスタースパーク", type: 3, level: 14 },
    { value: "kochirakoufukuanshiniinkaidesu_e", title: "こちら、幸福安心委員会です。", type: 3, level: 14 },
    { value: "tsubuyakimahoushoujorimuru_e", title: "つぶやき魔法少女りむる", type: 3, level: 14 },
    { value: "deddoboworudehoumuran_e", title: "デッドボヲルdeホームラン", type: 3, level: 14 },
    { value: "torauisukarupanteku_tori_e", title: "トラウィスカルパンテクートリ", type: 3, level: 14 },
    { value: "masemateikkumamamajikku_e", title: "ませまてぃっく♥ま+ま=まじっく！", type: 3, level: 14 },
    { value: "momongamonbanbantsu_e", title: "モモンが門番ばんっ☆", type: 3, level: 14 },
    { value: "yabaitsuyokuteatamaiiatainouta_e", title: "やばいつよくてあたまいいあたいのうた", type: 3, level: 14 },
    { value: "yuusyanonatsuyasumi_e", title: "ゆうしゃのなつやすみ", type: 3, level: 14 },
    { value: "wavurumahoutoshokan_e", title: "ワヴル魔法図書館", type: 3, level: 14 },
    { value: "aikurusifu_ru_e", title: "愛くるしフール -Not EASY!!-", type: 3, level: 14 },
    { value: "akayoriakaiyumeaya2gtechdanceremix_e", title: "赤より紅い夢-Aya2g Tech Dance Remix-", type: 3, level: 14 },
    { value: "kamitonarikaregamitakyoukaiisen_e", title: "神となり彼が見た境界線", type: 3, level: 14 },
    { value: "gunjougarasunosupika_e", title: "群青硝子のスピカ", type: 3, level: 14 },
    { value: "koiwadoumorohadouokhouteishiki_e", title: "恋はどう？モロ◎波動OK☆方程式!!", type: 3, level: 14 },
    { value: "shanhaikouchakanchineseteaorchidremix_e", title: "上海紅茶館 ～ Chinese Tea Orchid Remix", type: 3, level: 14 },
    { value: "juuseio_ba_furou_e", title: "獣性オーバーフロウ", type: 3, level: 14 },
    { value: "juumensouhuri_damuver_e", title: "十面相 (フリーダムVer)", type: 3, level: 14 },
    { value: "shounenwasoraotadoruprogpianoremix_e", title: "少年は空を辿る Prog Piano Remix", type: 3, level: 14 },
    { value: "shinshokukoudo666kyouchottoyubiryaku_e", title: "侵蝕コード：666　-今日ちょっと指（略-", type: 3, level: 14 },
    { value: "susumeissungundanrebellionofthedwarfs_e", title: "進め！イッスン軍団 -Rebellion of the Dwarfs-", type: 3, level: 14 },
    { value: "seishunshiterukairedilady_e", title: "青春☆してるかい？READY&LADY!", type: 3, level: 14 },
    { value: "sonezakisinjuu_e", title: "曾根崎心中", type: 3, level: 14 },
    { value: "chousoukaipasshoneitofi_ba__e", title: "超爽快☆パッショネイト・フィーバー", type: 3, level: 14 },
    { value: "nagareboshitokiminouta_e", title: "流れ星と君の歌", type: 3, level: 14 },
    { value: "higurashimoratoriamu_e", title: "茅蜩モラトリアム", type: 3, level: 14 },
    { value: "houkagosutoraido_e", title: "放課後ストライド", type: 3, level: 14 },
    { value: "makyoudatenrokusarieru_e", title: "魔境堕天録サリエル", type: 3, level: 14 },
    { value: "mahoushoujoutachinohyakunensaimastycoreremix_e", title: "魔法少女達の百年祭(masty core remix)", type: 3, level: 14 },
    { value: "yukionna_e", title: "雪女", type: 3, level: 14 },
    { value: "waruitokorogahitotsumonai_e", title: "悪いところがひとつもない！", type: 3, level: 14 },
    { value: "kodokunobannin_e", title: "孤独の番人", type: 3, level: 14 },
    { value: "badapplefeatnomico_i", title: "Bad Apple!! feat.nomico", type: 4, level: 14 },
    { value: "caramel_ribbon_i", title: "caramel ribbon", type: 4, level: 14 },
    { value: "gamboldfkslcrmx_i", title: "GAMBOL(dfk SLC rmx)", type: 4, level: 14 },
    { value: "hallelujah_i", title: "Ha･lle･lu･jah", type: 4, level: 14 },
    { value: "pulse_laser_i", title: "PULSE LASER", type: 4, level: 14 },
    { value: "goriragairundakabochagautattemitaver_i", title: "ごりらがいるんだ ～かぼちゃが歌ってみたver～", type: 4, level: 14 },
    { value: "batafuraikyatto_i", title: "バタフライキャット", type: 4, level: 14 },
    { value: "yasaimashininnnikuaburaoome_i", title: "ヤサイマシ☆ニンニクアブラオオメ", type: 4, level: 14 },
    { value: "koisuruuchuusensoutsuabababamikkusu_i", title: "恋する☆宇宙戦争っ！！ あばばばみっくす", type: 4, level: 14 },
    { value: "tsukinimurakumohananikaze_i", title: "月に叢雲華に風", type: 4, level: 14 },
    { value: "rintoshitesakuhananogotokusupu_kyiterumyinmikkusu_i", title: "凛として咲く花の如く スプーキィテルミィンミックス", type: 4, level: 14 },
    { value: "black_or_white_e", title: "BLACK or WHITE?", type: 3, level: 15 },
    { value: "hyena_e", title: "HYENA", type: 3, level: 15 }
]);

// Initial music_db
function initialMusicDBDOM() {
    for (var level = 1; level <= 16; ++level) {
        var db_result = music_db({ level: level }).order("title").order("type");
        if (db_result.count() != 0) {
            $("#music").append("<optgroup label=\"lv" + level + "\"></optgroup>");
            var current_optgroup = $("#music optgroup:last-child");
            db_result.each(function (entry) {
                var type_name = "";
                if (entry.type == 1)
                    type_name = "NOV";
                else if (entry.type == 2)
                    type_name = "ADV";
                else if (entry.type == 3)
                    type_name = "EXH";
                else if (entry.type == 4)
                    type_name = "INF";
                current_optgroup.append("<option value=\"" + entry.value + "\">" + entry.title + "[" + type_name + "]</option>");
            });
        }
    }
}