//////動作環境―――――――――――――――――――――――――――――――＋
/*
【PC(win10)】
chrome〇
Firefox〇
Edge×
【android】
chrome△(フロントカメラしか起動しない?一度だけ成功したような…)
Firefox△(使うカメラ選択あり)
sumsung×
【ipados】
safari△(バックカメラ起動するが手を取得してくれない)
chrome×
他ぷにるおぺらなどなど×
*/

//todo＋//體育服 遊戯―――――――――――――――――――――――――――――――＋
//ラグいので改善したい l2d handtrack.js それぞれ重いっぽい
//Bug
//実機で音が遅れて読み込みされた時点で大音量で再生されるっぽいのをどうするか


//tension(興奮度)が60になると腕を頭の後ろで組むポーズに変わる

//tension(興奮度)が100になるとボタンが出現
//押すとフィニッシュモード突入
//3-2-1のカウントダウンの後、白フラッシュと同時に射精
//白フラッシュが明けるとピースしてる
//胸から液が垂れる
//射精後も動かすことができる


//////＋―――――――――――――――――――――――――――――――＋

const LIVE2DCUBISMCORE = Live2DCubismCore;//おまじない

// 最優先の言語だけ取得
const language = (window.navigator.languages && window.navigator.languages[0]) ||
            window.navigator.language ||
            window.navigator.userLanguage ||
            window.navigator.browserLanguage;

const min_version = false;//軽量verかどうか
const device_orientation = true;//デバイスのジャイロを有効にするか
let SOUNDon = false;//音全般の再生を有効にするか
//SOUND サウンド関連----------------------------------　
let BGMon = true;
let SEon = true;
let VOICEon = true; //sound ON/OFF
//コメントアウトON/OFF は　　上の　/*　を　//*/　にするだけ
/* 
SOUNDon=true;
//*/
if(SOUNDon === false){BGMon = SEon = VOICEon = false};

let SOUND_def_volume = SOUND_volume = 1;//マスターボリューム
let BGM_def_volume = BGM_volume = 0.2;
let SE_def_volume = SE_volume = 0.7;
let VOICE_def_volume = VOICE_volume = 0.8;
let strokev = 0;//動かしている間のSE用関数

const modelfilter_on = 0;//フィルターのON/OFF 1でon
if(modelfilter_on === 1){
modelfilter_zb_state=0;
};
const word_debug = true;//中央上に文字情報を載せてデバッグするモード
const fullsc = 0;//フルスクリーン用変数 1でフルスクリーン許可

//_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/

let point;//タップしている座標

let cameramovestoptime = 0; //カメラの前で静止している時間
let tap = -1;//タップ状態とタップし続けている時間

let cural = 0;//カーソル画像のアルファ
let playerstop = false;//プレイヤーの動きがストップしたと判定したか否か
let passtime = gametime = 0;//経過時間/ゲームを開始してからの経過時間
let smash = 0;//時々動作を変えるための変数 会心の一撃的な
let TMX = TMY = TMXY = befTMX = befTMY = TMXavg = TMYavg= 0;//handtracktとタップの動きを変換するための変数
// Option & オプション・タイトル画面変数----------------
let optionmode = -1;//オプションモード
let titlezoom = 0.3;//タイトル画面のズーム率
let first_fap = 0; //タイトル画面でのしこる手の動き指定用
let option_button_BGM_state = option_button_SE_state = option_button_VOICE_state = 0;//オプション関連
//Model モデルの動き関連の変数----------------
let motion_mode = 0;//キャラの動きの状態
let BstRYpower = BstLYpower = 0;
let eye_smile = 0;//目の表情のランダム感のための変数
let pHeadX = pHeadY = 0;//Param{}から外れたところにあるエフェクトの位置指定用
let modelalpha = 1;//モデルの透明度
let speedFR = speedFL = 0.1;//ゆらぎ　瞳とか耳とか、ほぼ同時に動くけどほんの少しズレが欲しい箇所
let eye_open_relax = 0;//目の開きのリラックス具合
let eye_close = 180;//まばたき
let EYE_X_potision = EYE_Y_potision = Cheek_potision = Brow_potision = Heart_potision = 0;//potision系
let Headstate_changetime = Headstate_changetime_def = 700;//首の位置を定期的に変える時間の最大
let mouthopen = mouthform = 0;//口関連の動き設定用
let endure = 0;//目閉じ俯き快感食いしばり用
let earrspeed = earlspeed = 0;//左右耳の動くスピード
let modelusery = 0;//モデルの通常y座標
let HeadXstate = HeadYstate = HeadZstate = HeadXstateto = HeadYstateto = HeadZstateto = shakehead = 0;//頭関連の動き設定用
let degree = radian = updown = 0;//上下運動用変数
let eyes_partly_open = 0;//000
let tensionup;
let heartcount = 0;//ハートの出た回数　左右の出現位置の振り分けにも使用
let shake_count = 0;//振った回数 万歩計に反映
let zoom = zoomdef = zoom_v = zoom_mode = 1.2;//デフォルトのズーム率(キャラクターのサイズ)
let Breathtime = 0; //呼吸モーション用変数
let breathtox;
let tension = 0.1;//興奮度
let tensiondown = 0.03;//毎フレームダウンするtensionの値
let tensiondowntime = 7;//この秒数経過するとtensionダウンし始める
//Tap タップ関連の変数----------------
let tapx = tapy = beforex = beforey = tapmovex = tapmovey = befmovex = befmovey = tapmovexy = tapnotmovingtime = 0;//タップ関連の関数
let tapcount = 0;//タップした回数
let curdefsize = 0.2;//カーソルデフォサイズ
let movex=movey = 0;//カーソルの毎フレームごとに移動量
let moving = false;//カーソルを動かしているかどうか
//handtrack.js ハンドトラック関連の変数----------------
let topX = deftopX = bottomX = defbottomX = topY = deftopY = bottomY = defbottomY = 0;//シコシコ上下動の上限topYと下限bottomYの設定
let MoveDirectionY_ChangeCount = 0;//Y方向の動きを変更した回数=シコシコの回数
let handyY_total = 0;//手を動かしたY座標の蓄積　切り返すとリセット
let handX = befhandX = handyX = 0;
let handY = befhandY = handyY = 0;
let sameDY = 0;//同じ方向に手を動かし続けると加算される 上方向は+ 下方向は- 切り替え時に0になる
let handwidth;
let handheight;
let handin_time = 0;//手が画面内にいる時間
let handin_count = 0;//手が画面内に入った回数
let defgrip = gripex = grip = Bstgrip = 0;//握る力の変化値
let btY = defbtY = 1;//手の上下動の上限と下限の距離
//_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/￣_/

/* Get the webcam */
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

const modelParams = {
    flipHorizontal: false,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 0,        // maximum number of boxes to detect
    iouThreshold: 0.7,      // ioU threshold for non-max suppression
    scoreThreshold: 0.5,    // confidence threshold 手とみなすしきい値　1に近ければ近いほど確からしくないと手として認めてくれなくなる
}
      
// Select everything in the HTML
const video = document.querySelector('#video');
//const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
//const context = canvas.getContext('2d');

let vmodel;

handTrack.startVideo(video)
    .then(status => {
        if(status){
            navigator.getUserMedia({video: {}}, stream => {
                video.srcObject = stream
   //             setInterval(runDetecotion, 10)
                setInterval(runDetecotion, 100)

            },
            err => console.log(err)
        )
    }
})

const camerawidtht=canvas.width;
const cameraheight=canvas.height;

function runDetecotion() {
    vmodel.detect(video).then(predictions => {
//     vmodel.renderPredictions(predictions, canvas, context, video)
        if (predictions.length > 0) {
//bbox: [x, y, width, height], //この1番目を取得するとx
if(handin_time < 0){handin_time=0
handin_count++;
};
handin_time++;
befhandX=handX;
handX = predictions[0].bbox[0] ;
handyX = handX - befhandX;


befhandY=handY;
handY = predictions[0].bbox[1] ;
handyY = handY - befhandY;

handwidth = predictions[0].bbox[2] ;
handheight = predictions[0].bbox[3] ;

defgrip=gripex;
gripex=handwidth+handheight;
grip=gripex-defgrip;

        }else{
//止まってるとさすがに大丈夫だが
//手を動かしてると（特に手首をひねりながら動かすと)認識が切れてこっち側(else)になってしまう
//↑側で取得したhadnyXなどの各種値は一旦こっち側を通過すると…console側では10回に9回は
//前フレームで取得した値のままになる(何かの拍子に10回に1回くらい違うこともあった
//手を動かしていてそのまま画面外にいった場合、handyXYが同値になり続けるのを避ける
handX=handX/2;
handY=handY/2;
if(handin_time > 0){handin_time=0};
handin_time-=1;
};
    })
}



handTrack.load(modelParams).then(lvmodel => {
vmodel = lvmodel;
    });

//handtrack.js app area END----------------------------------------------------------------------



    PIXI.loader//Live 2D model 
        .add('moc', "./assets/chara.moc3", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })
        .add('texture00', "./assets/texture_00.png")
        .add('chara.model3', "./assets/chara.model3.json", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON })
        .add('emptymotion', "./assets/empty.motion3.json", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON })
        .add('physics', "./assets/chara.physics3.json", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON })
        .load(function (loader, resources) {
const app = new PIXI.Application(window.innerWidth, window.innerHeight, { /*antialias: false,*/ /* resolution:window.devicePixelRatio || 1, */ transparent: true, resolution: window.devicePixelRatio || 1,/*preserveDrawingBuffer: false,antialias: true,autoDensity : true,*/ /*autoResize: true,*/  view : document.getElementById("js-canvas") });
//高解像度端末対応2行 https://qiita.com/rantaro/items/8f8cae562f5e0fff1805
/*
resolution: window.devicePixelRatio || 1,
autoResize: true
*/

document.body.appendChild(app.view);
        const moc = LIVE2DCUBISMCORE.Moc.fromArrayBuffer(resources['moc'].data);
        const model = new LIVE2DCUBISMPIXI.ModelBuilder()
            .setMoc(moc)
            .setTimeScale(1)
            .addTexture(0, resources['texture00'].texture)
            .setPhysics3Json(resources['physics'].data)
            .addAnimatorLayer("Drag", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1)
            .build();
        app.stage.addChild(model);
//	app.stage.addChild(model.masks);
        const emptyAnimation = LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(resources['emptymotion'].data);
    //  .getLayer("Drag")
      //error  .play(animation);
model.alpha=0;
model.interactiveChildren = false;
model.visible=true;

if(modelfilter_on === 1){
//モデルへのブルームフィルター(要pixi.filter.js)
let modelfilter= new PIXI.filters.AdvancedBloomFilter
modelfilter.threshold=0.5;
modelfilter.bloomScale=0.6;
modelfilter.quality=10;
modelfilter.brightness=0.8;
modelfilter.blur=0.9;
};


breath = PIXI.Sprite.fromImage('./assets/breath.png');
app.stage.addChild(breath);
breath.anchor.set(0.5);

//しぶき画像テクスチャ化
const sweattexture = new PIXI.Texture.from('./assets/sweat.png');

const sweatgroup = new PIXI.Container();
app.stage.addChild(sweatgroup);

sweatface = new PIXI.Sprite(sweattexture);app.stage.addChild(sweatface);sweatface.anchor.set(0.5);
sweatarmpitr = new PIXI.Sprite(sweattexture);app.stage.addChild(sweatarmpitr);sweatarmpitr.anchor.set(0.5);
sweatarmpitl = new PIXI.Sprite(sweattexture);app.stage.addChild(sweatarmpitl);sweatarmpitl.anchor.set(0.5);
sweatBstr = new PIXI.Sprite(sweattexture);app.stage.addChild(sweatBstr);sweatBstr.anchor.set(0.5);
sweatBstl = new PIXI.Sprite(sweattexture);app.stage.addChild(sweatBstl);sweatBstl.anchor.set(0.5);

sweatgroup.addChild(sweatface,sweatarmpitr,sweatarmpitl,sweatBstr,sweatBstl);


sweatface.alpha=sweatarmpitr.alpha=sweatarmpitl.alpha=sweatBstr.alpha=sweatBstl.alpha=0;



player_shadow = PIXI.Sprite.fromImage('./assets/player_shadow.png');
app.stage.addChild(player_shadow);
player_shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
player_shadow.alpha=0.2;
player_shadow.anchor.set(0.5);
player_shadow.visible=false;


light = PIXI.Sprite.fromImage('./assets/light.jpg');
app.stage.addChild(light);
light.blendMode = PIXI.BLEND_MODES.SCREEN;
light.alpha=0.5;

dark = PIXI.Sprite.fromImage('./assets/dark.jpg');
app.stage.addChild(dark);
dark.blendMode = PIXI.BLEND_MODES.MULTIPLY;

const heart = PIXI.Sprite.fromImage('./assets/heart.png');
app.stage.addChild(heart);
const heart2 = PIXI.Sprite.fromImage('./assets/heart.png');
app.stage.addChild(heart2);
const heart3 = PIXI.Sprite.fromImage('./assets/heart.png');
app.stage.addChild(heart3);

heart.visible=heart2.visible=heart3.visible=false;




sidebutton = PIXI.Sprite.fromImage('./assets/sidebutton.jpg');
app.stage.addChild(sidebutton);
sidebutton.alpha=0;

//Title parts --------------------------------------------------------------------------
const titles = new PIXI.Container();
app.stage.addChild(titles);


//title 説明&注意事項
title_body = PIXI.Sprite.fromImage('./assets/title/title_body.png');
app.stage.addChild(title_body);
title_body.anchor.set(0.5);

title_stick = PIXI.Sprite.fromImage('./assets/title/title_stick.png');
app.stage.addChild(title_stick);
title_stick.anchor.set(0.5);

title_hand = PIXI.Sprite.fromImage('./assets/title/title_hand.png');
app.stage.addChild(title_hand);
title_hand.anchor.set(0.5);


const allowcamera = PIXI.Texture.fromImage('./assets/title/title_allowcamera.png');
const tapstart = PIXI.Texture.fromImage('./assets/title/title_tapstart.png');

const title_allowcamera = new PIXI.Sprite(allowcamera);
app.stage.addChild(title_allowcamera);
title_allowcamera.anchor.set(0.5);
title_allowcamera.alpha=0;


title_tablet = PIXI.Sprite.fromImage('./assets/title/title_tablet.png');
app.stage.addChild(title_tablet);
title_tablet.anchor.set(0.5);

title_tap = PIXI.Sprite.fromImage('./assets/title/title_tap.png');
app.stage.addChild(title_tap);
title_tap.anchor.set(0.5);

titles.addChild(title_body,title_stick,title_hand,title_allowcamera,title_tablet,title_tap);

wid=window.innerWidth;
hei=window.innerHeight;

lens = PIXI.Sprite.fromImage('./assets/lens.jpg');
app.stage.addChild(lens);
lens.anchor.set(0.5);
lens.alpha=0.75;

//Option parts --------------------------------------------------------------------------
const optionparts = new PIXI.Container();
app.stage.addChild(optionparts);

soundPath_BGM = PIXI.Sprite.fromImage('./assets/title/option_line.png');
app.stage.addChild(soundPath_BGM);
soundPath_BGM.anchor.set(0.5);
soundPath_SE = PIXI.Sprite.fromImage('./assets/title/option_line.png');
app.stage.addChild(soundPath_SE);
soundPath_SE.anchor.set(0.5);
soundPath_VOICE = PIXI.Sprite.fromImage('./assets/title/option_line.png');
app.stage.addChild(soundPath_VOICE);
soundPath_VOICE.anchor.set(0.5);

soundPath_BGM.visible=soundPath_SE.visible=soundPath_VOICE.visible=lens.visible=false;

optionBGM = PIXI.Sprite.fromImage('./assets/title/optionBGM.png');
app.stage.addChild(optionBGM);optionBGM.anchor.set(0.5);
optionSE = PIXI.Sprite.fromImage('./assets/title/optionSE.png');
app.stage.addChild(optionSE);optionSE.anchor.set(0.5);
optionVOICE = PIXI.Sprite.fromImage('./assets/title/optionVOICE.png');
app.stage.addChild(optionVOICE);optionVOICE.anchor.set(0.5);

optionBGM.visible=optionSE.visible=optionVOICE.visible=false;

const optionbutton_a = PIXI.Texture.fromImage('./assets/title/option_buttun.png');
const optionbutton_b = PIXI.Texture.fromImage('./assets/title/option_buttun_cancel.png');


optionbutton = new PIXI.Sprite(optionbutton_a);
app.stage.addChild(optionbutton);
optionbutton.anchor.set(0.5);


const option_button = new PIXI.Container();
app.stage.addChild(option_button);

let option_button_BGM = new PIXI.Graphics();
option_button_BGM.lineStyle(2, 0x000000, 0.5);
option_button_BGM.beginFill(0xFFFFFF, 0.9);
option_button_BGM.drawCircle(100, 50, 50);
option_button_BGM.endFill();
app.stage.addChild(option_button_BGM);

let option_button_SE = new PIXI.Graphics();
option_button_SE.lineStyle(2, 0x000000, 0.5);
option_button_SE.beginFill(0xFFFFFF, 0.9);
option_button_SE.drawCircle(100, 50, 50);
option_button_SE.endFill();
app.stage.addChild(option_button_SE);

let option_button_VOICE = new PIXI.Graphics();
option_button_VOICE.lineStyle(2, 0x000000, 0.5);
option_button_VOICE.beginFill(0xFFFFFF, 0.9);
option_button_VOICE.drawCircle(100, 50, 50);
option_button_VOICE.endFill();
app.stage.addChild(option_button_VOICE);


option_button.addChild(option_button_BGM,option_button_SE,option_button_VOICE);
option_button_BGM.visible=option_button_SE.visible=option_button_VOICE.visible=false;

option_button_BGM.interactive = option_button_SE.interactive = option_button_VOICE.interactive = optionbutton.interactive = true;
option_button_BGM.buttonMode = option_button_SE.buttonMode = option_button_VOICE.buttonMode = optionbutton.buttonMode = true;

option_button_BGM.on('pointerdown', onClickBGM)
option_button_SE.on('pointerdown', onClickSE)
option_button_VOICE.on('pointerdown', onClickVOICE)
optionbutton.on('pointerdown', onClickoption)

option_button_BGM_tap=option_button_SE_tap=option_button_VOICE_tap=false;


optionparts.addChild(soundPath_BGM,soundPath_SE,soundPath_VOICE,optionBGM,optionSE,optionVOICE,option_button_BGM,option_button_SE,option_button_VOICE,option_button);
//optionparts.visible=false;

//Cursor --------------------------------------------------------------------------
const Cur = PIXI.Texture.fromImage('./assets/tap_effect.png');
const cur = new PIXI.Sprite(Cur);
app.stage.addChild(cur);
cur.blendMode = PIXI.BLEND_MODES.SCREEN;
cur.scale.x=cur.scale.y=curdefsize;
cur.anchor.x=cur.anchor.y=0.5;
cur.alpha = cural;

rippleefect = PIXI.Sprite.fromImage('./assets/tap_effect.png');
app.stage.addChild(rippleefect);
rippleefect.anchor.set(0.5);



//初期設定
onResize();

option_button_BGM.x=wid/5+wid/30+BGM_def_volume*8*((wid-wid/5-wid/30)-(wid/5+wid/30))/10;
option_button_SE.x=wid/5+wid/30+SE_def_volume*8*((wid-wid/5-wid/30)-(wid/5+wid/30))/10;
option_button_VOICE.x=wid/5+wid/30+VOICE_def_volume*8*((wid-wid/5-wid/30)-(wid/5+wid/30))/10;


option_button_BGM_state_def=option_button_BGM.x;
option_button_SE_state_def=option_button_SE.x;
option_button_VOICE_state_def=option_button_VOICE.x;

title_tap.y=hei*2
title_body.y=hei*1.2;

title_tablet.y=hei*1.5;
title_tablet.x=-hei;

const textStyle = new PIXI.TextStyle({
    fontFamily: ["M+ 1m"],
    fontSize: 24, 
    fontWeight: "normal",
    fill: 0x000000,
    wordWrap:true,
    wordWrapWidth:wid/2,
    breakWords: true
});


let notes = new PIXI.Text("Enable your webcamera when prompted (no worries I'm not sending your pictures anywhere.", textStyle);
if(language == "ja" ){
let notes = new PIXI.Text("※カメラを有効にして手の動きを映すと、よりアプリをお楽しみ頂けます。(カメラに映った映像は動作方向の取得だけに使われ、どこにも送信されることはありません)", textStyle);
};
notes.anchor.set(0.5);
notes.x = wid/2;
notes.y = hei/1.2;
app.stage.addChild(notes);


if(word_debug === true ){

txt = new PIXI.Text('sample text', textStyle);
txt.anchor.set(0.5);
txt.x = wid/2;
txt.y = hei/6;
app.stage.addChild(txt);
};
/*
//モデルへのズームブラー
let modelfilter_zb= new PIXI.filters.ZoomBlurFilter;
modelfilter_zb.center = [wid/2, 0];
*/
app.stage.alpha=0;


if(modelfilter_on === 1){
let modelfilter2= new PIXI.filters.DropShadowFilter;
modelfilter2.distance=30;
modelfilter2.blur=5;
modelfilter2.alpha=0.8;
modelfilter2.quality=10
//線画つけるとズームブラー無効になる
model.filters = [/*modelfilter_zb,*/modelfilter,modelfilter2];//この順番じゃないとおかしくなる
};


breathEND=waterEND=true;//音声、SEが終わってないのにしゃべりだすの禁止
soundcount=insertEND=0;

//全体フィルター
if(modelfilter_on === 1){
const screenFilter = new PIXI.filters.CRTFilter;
};
//app.stage.filters = [screenFilter];

/*
// 前回の描画結果を表示するためのSpriteを生成してステージに追加
  // ブラーをかけて透明度を下げる
  const lastFrame = new PIXI.Sprite()
  const blurFilter = new PIXI.filters.BlurFilter(1.0)
  lastFrame.filters = [blurFilter]
  lastFrame.alpha = 0.85
  app.stage.addChild(lastFrame)
*/

//Debug シコシコ位置測定用ボタン
 


if(BGMon === true){

 bgm = new Howl({
 src: ['./sound/Sikosiko Post.wav'],
 volume:BGM_def_volume,
 autoplay: false,
 loop: true,
});

};
// ------------------------------------------------------------
// 音声素材:【みじんこ素材（CV誠樹ふぁん）】
// ------------------------------------------------------------
if(SEon === true){

const insertSE = new Howl({
  src: ['./sound/insertSE.wav'],
  volume: SE_def_volume,
  sprite: {
    up1: [0, 452],//[start time,voice length]
    up2  : [452, 986-37],
    up3: [986, 1451-986],
    up4: [1451, 1776-1451],
    up5: [1776, 2310-1776],
    up6: [2310, 2995-2310 ],

    up7: [2995, 3168-2995],
    up8: [3168, 3475-3168],
    up9: [3475, 3780-3475],
    up10: [3780, 4129-3780],

    down1: [4129, 4694-4129],
    down2: [4694, 5309-4694],
    down3: [5309, 6067-5309],
    down4: [6067, 6975-6067],
    down5: [6975, 7483-6975],
    down6: [7483, 8078-7483],

    down7: [8078, 8362-8078],
    down8: [8362, 8611-8362],
    down9: [8611, 8971-8611],
    down10: [8971, 9321-8971],  
  },

   onend: function() {
        insertEND=0;  
 }
});

stroke = new Howl({
  src: ['./sound/lotion_all_time.wav'],
 volume:0,
 autoplay: false,
 loop: true,
});

const touchSE = new Howl({
  src: ['./sound/SEskin.wav'],
  volume: SE_def_volume/2,
  sprite: {
//kiss in
    touch1: [0, 37],//[start time,voice length]
    touch2: [37, 74-37],
    touch3: [74, 112-74],
    touch4: [112, 184-112],
    touch5: [184, 224-184],
    touch6: [224, 240-224],
    touch7: [240, 274-240],
    touch8: [274, 293-274],
    touch9: [293, 327-293],
    touch10: [327, 341-327],
    touch11: [341, 362-341],
    touch12: [362, 386-362],
    touch13: [386, 466-386],
    touch14: [466, 490-466],
    hairtouch1: [490, 553-490],
    hairtouch2: [553, 602-553],


  },
});

};//SEon true 

if(VOICEon === true){
voices = new Howl({
  src: ['./sound/voice.wav'],
  volume: VOICE_def_volume,
  sprite: {
//kiss in
    nn: [0, 545],//[start time,voice length]
    n: [545, 905-545],
    n2: [917, 1207-905],
    fu: [1219, 1544-1207],
    n3: [1384, 1822-1384],
//kiss 9 to raf
    kiss3: [1822, 2113-1822],//chup
    kiss2: [2113, 2356-2113],//chu
    kiss4: [2345, 2867-2345],//chupa
    kiss1: [2800, 3076-2800],//ch
    kissarrange: [3053, 3842-3053],//poe
    kiss7: [3842, 4532-3842],//jhu
    kiss6: [4532, 5240-4532 ],//ju
    kiss8 : [5240, 6000-5240 ],//ju-pti
    kiss9 : [6000, 7105-6000 ],//pi-pu-chu
    kiss5 : [7105, 7430-7105 ],//chupi
 //kiss out
/*
    chu-e : [7430, 8533-7430 ],
    chu-ae : [8533, 9624-8533 ],
    juru-ae : [9624, 11366-9624 ],
    ju-a-e : [11366, 13514-11366 ],
    chu-ee : [13514, 15394-13514 ],
    chu-n-n : [153W94, 17280-15394 ],
    juru : [17280, 18391-17280 ],
*/


//breath    
    sigh13 : [18391, 19687-18391 ],//fu-n
    sigh6 :  [19687, 20826-19687 ],//haa
    sigh2 :   [20826, 21629-20826 ],//ha
    sigh9 :  [21629, 22377-21629 ],//fun
    sigh5 :  [22377, 22894-22377 ],//att
    sigh14 : [22894, 23568-22894 ],//hatt
    sigh12 : [23568, 24497-23568 ],//thaa
    sigh4  : [24497, 25434-24497 ],//haa2
    sigh8  : [25434, 25878-25434 ],//afn
    sigh1   : [25878, 26366-25878 ],//at
    sigh22   : [26366, 27655-26366 ],//han-at
    sigh10   : [27655, 28467-27655 ],//hat
    sigh11   : [28467, 29094-28467 ],//haat
    sigh15   : [29094, 29764-29094 ],//hahh
    sigh24   : [29764, 31243-29764 ],//hi-hahh 
    sigh25   : [31243, 32055-31243 ],//hah-hahh
    sigh23   : [32055, 32943-32055 ],//ha-h-ha 
    longbreath11   : [32943, 34389-32943 ],//hahi-ha-hi-
    sigh21   : [34389, 35423-34389 ],//ha-hi-
    sigh20   : [35423, 36533-35423 ],//haa-h-
    sigh7      : [36533, 36989-36533 ],//hfu
    sigh16      : [36989, 37627-36989 ],//haan
    sigh17      : [37627, 38169-37627 ],//hahi
    sigh3      :  [38169, 38730-38169 ],//hah
    longbreath7  :  [38730, 40176-38730 ],//hahahhah
    longbreath8  :  [40176, 41250-40176 ],//hahahaha-h
    longbreath9  :  [41250, 42487-41250 ],//hahihahha-h 
    longbreath14  :  [42487, 43751-42487 ],//hahi-ha-hi-2
    sigh18 :  [43751, 44463-43751 ],//haha-
    sigh19 :  [44463, 45731-44463 ],//hhah
    longbreath16 :  [45731, 47738-45731 ],//ha-ha-h-ha-ha-ha-h 
    longbreath15 :  [47738, 49292-47738 ],//haaa-h-ha-ha-h-
    longbreath12 :  [49292, 50368-49292 ],//haaha-haaha
    longbreath13 :  [50368, 51809-50368 ],//fhaha-fhaaha
//long breath
    longbreath2 :  [51809, 51809-51809 ],//fha--hi--
    longbreath4 :  [51809, 53277-51809 ],//fha--hi--2
    longbreath3 :  [53277, 54950-53277 ],//fha--fu--
    longbreath1 :  [54950, 56550-54950 ],//fha---f
    longbreath10:  [56550, 59254-56550 ],//fha--f-fha-fu- OK
    longbreath5 :  [59254, 100866-59254-40000 ],//fhya--fu- めっちゃ長い 60で1分なので急に100866はおかしい　-40000
    longbreath6 :  [100866-40000, 102789-100866 ],//fhya--fu-2 
    sigh1 :  [102789-40000, 105000-102789 ],//haaa---
//a
    breath4 :  [105000-40000, 106507-105000 ],//aanaaa もー　くらい？
    breath5 :  [106507-40000, 107687-106507 ],//nna-fun  ズレてehettくらいになっちゃってる 
    breath2 :  [107687-40000, 684 ],//hahan  バグってスポーンって音になる
    breath3 :  [108371-40000, 109223-108371 ],//fufun
    breath7 :  [109223-40000, 110000-109223 ],//ha-a-hn
    breath1 :  [110000-40000, 110646-110000 ],//fu-n 
    breath6 :  [110646-40000, 112624-110646 ],//入れられた感 uuhfha-
    breath8 :  [112624-40000, 114187-112624 ],//uun-ha-fn
    breath5 :  [114187-40000, 114992-114187 ],//fun-att
    breath12 :  [114992-40000, 116110-114992],//nayamasii n-n-att
    nbreath7 :  [116110-40000, 118475-116110],//nayamasii long nnn-a-ha-u-un-ha
    nbreath6 :  [118475-40000, 120000-118475],// ha-n-n-un-ha
    nbreath5 :  [120000-40000, 121474-120000],//nayamasi itasou? hauuuuhan
    nbreath4 :  [121474-40000, 122590-121474],//fuunhaaan
    nbreath3 :  [122590-40000, 123703-122590],//hauun-han
    nbreath1 :  [123703-40000, 124814-123703],//--uzn-un
    nbreath2 :  [124814-40000, 125814-124814],//fhafun-un
    nbreath8 :  [125814-40000, 127557-125814],//futtu-uu-uu-n-fun
 //   nbreath9 :  [127557, 130093-127557],//futtu-uu-uu-n-fun2
    breath13 :  [130093-40000, 131346-130093],//fu-a-utt
    breath14 :  [131346-40000, 132524-131346],//ha-ii-itt
    nbreath7 :  [132524-40000, 133993-132524],//fuuattaahauu
    nbreath10 :  [133993-40000, 136898-133993],//futtu-uu-uu-n-fun3
    breath9 :  [136898-40000, 137683-136898],// big volume short ha-g
    breath11 :  [137683-40000, 138937-137683],//aa-uu-t
    breath10 :  [138937-40000, 139801-138937],//un-ntt
//gimon?
    un :  [139801-40000, 140550-139801], //un
    uun :  [140550-40000, 141715-140550],//uun
    uuun :  [141715-40000, 142460-141715],//uuun
//laugh
    laugh1 :  [142460-40000, 143371-142460], //fufu
    laugh2 :  [143371-40000, 144639-143371], //nfufu
//fuman
    muu :  [144639-40000, 146030-144639],
    mu :  [146030-40000, 147077-146030],
    moo :  [147077-40000, 148123-147077],
//laugh2
    laugh3 :  [148123-40000, 149196-148123], //uhitt
    laugh4 :  [149196-40000, 150794-149196],//nfufuhi
    laugh5 :  [150794-40000, 152245-150794],//nfufun
    laugh6 :  [152245-40000, 152927-152245],//ihi
    laugh7 :  [152927-40000, 153886-152927],//ehihi
    laugh8 :  [153886-40000, 155684-153886],//ehett
    laugh9 :  [155684-40000, 157456-155684],//hyafufufutt

  },

   onend: function() {
        breathEND=true;  
 }

});

};

// ------------------------------------------------------------
// ジャイロセンサ
// ------------------------------------------------------------
let befaX = 0, befaY = 0, befaZ = 0;
let aX = 0, aY = 0, aZ = 0;                     // 加速度の値を入れる変数を3個用意
 
// 加速度センサの値が変化したら実行される devicemotion イベント
window.addEventListener("devicemotion", (dat) => {

    befaX = aX
    befaY = aY 
    befaZ = aZ

    aX = dat.accelerationIncludingGravity.x-befaX;    // x軸の重力加速度（Android と iOSでは正負が逆）
    aY = dat.accelerationIncludingGravity.y-befaY;    // y軸の重力加速度（Android と iOSでは正負が逆）
    aZ = dat.accelerationIncludingGravity.z-befaZ;    // z軸の重力加速度（Android と iOSでは正負が逆）

});


let device_z = 0, device_x = 0, device_y = 0;       
let def_device_z = 0, def_device_x = 0, def_device_y = 0;       
let drz = 0, drx = 0, dry = 0;       


if(device_orientation === true){
window.addEventListener("deviceorientation", (dat) => {


    def_device_z=device_z;
    def_device_x=device_x;
    def_device_y=device_y;

    device_z = dat.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
    device_x  = dat.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
    device_y = dat.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）

    drz=device_z-def_device_z;
    drx=device_x-def_device_x;
    dry=device_y-def_device_y;


});

};
// ------------------------------------------------------------
// Tap EVENT
// ------------------------------------------------------------
app.stage.interactive = true;
app.stage
	.on('pointerdown', onClick)
	.on('pointerup', pointerUp)
	.on('pointerupoutside', pointerUp)
	.on('pointermove', onPointerMove)
function onClick () {tap=1;rippleefect.alpha=1;

/*
if(fullsc === 0){
toggleFullScreen();
onResize();
};
*/


//隅っこを押すと拡大縮小
if(cur.position.x < wid/10){
zoom_mode=1;
sidebutton.anchor.x=0;
sidebutton.x=0;
}else if(cur.position.x > wid-wid/10){
zoom_mode=2;
sidebutton.anchor.x=1;
sidebutton.x=wid;
}else if(cur.position.y < hei/10){
zoom_mode=3;
sidebutton.anchor.y=0;
sidebutton.y=0;
}else if(cur.position.y > hei-hei/10){
zoom_mode=4;
sidebutton.anchor.y=1;
sidebutton.y=hei;
};


//縦横サイズ変形
if(zoom_mode === 1 || zoom_mode === 2){
sidebutton.width=wid/10;
sidebutton.height=hei;
sidebutton.anchor.y=0.5;
sidebutton.y=hei/2;
}
if(zoom_mode === 3 || zoom_mode === 4){
sidebutton.width=wid;
sidebutton.height=hei/10;
sidebutton.anchor.x=0.5;
sidebutton.x=wid/2;
}

tapcount++;
};
function pointerUp () {//リタップした時のみ、一度きり(でいい)処理はここ
zoom_v=zoom_mode=0;
tap=-1;tapx=tapy=tapnotmovingtime=tapmovex=tapmovey=0;cur.texture=Cur;
option_button_BGM_tap=option_button_SE_tap=option_button_VOICE_tap=false;


BGM_volume=Math.round((option_button_BGM.x/wid*1.8 - 0.38) * 10) / 10;
if(BGMon === true){bgm.volume(BGM_volume)};
SE_volume=Math.round((option_button_SE.x/wid*1.8 - 0.38) * 10) / 10;
VOICE_volume=Math.round((option_button_VOICE.x/wid*1.8 - 0.38) * 10) / 10;


};

function onClickBGM () {if(optionmode === 1){option_button_BGM_tap=true}};
function onClickSE () {if(optionmode === 1){option_button_SE_tap=true}};
function onClickVOICE () {if(optionmode === 1){option_button_VOICE_tap=true}};
function onClickoption () {

optionmode = optionmode * -1;

if(optionmode === -1 ){optionbutton.texture = optionbutton_a}else{optionbutton.texture = optionbutton_b};
notes.visible = ! notes.visible;
option_button_BGM.visible = ! option_button_BGM.visible;
option_button_SE.visible = ! option_button_SE.visible;
option_button_VOICE.visible = ! option_button_VOICE.visible;

soundPath_BGM.visible =  soundPath_SE.visible = soundPath_VOICE.visible = lens.visible = option_button_BGM.visible;
optionBGM.visible=optionSE.visible=optionVOICE.visible =  option_button_BGM.visible;


};

// ------------------------------------------------------------


//app.ticker.add(function(deltaTime) { //()にdeltaTime入れると物理効くようになった!
app.ticker.add(deltaTimeSeconds => { //()にdeltaTime入れると物理効くようになった!
 
       model.update(deltaTimeSeconds); //          //model.masks.update(app.renderer); //	stats.update();

//重かったら非表示
if(optionmode === 1){tapcount=-1};
point = app.renderer.plugins.interaction.mouse.getLocalPosition(app.stage);
console.log("%chandD_change" + point.x, "background-color:red;color:white;font-size:15px");

app.stage.alpha+=(1-app.stage.alpha)*0.1



//音量ボタンのカーソル追従とアルファ
if(option_button_BGM_tap === true ){option_button_BGM.x=cur.position.x-option_button_BGM.width;option_button_BGM.alpha=0.5}else{option_button_BGM.alpha=1};
if(option_button_SE_tap === true ){option_button_SE.x=cur.position.x-option_button_SE.width;option_button_SE.alpha=0.5}else{option_button_SE.alpha=1};
if(option_button_VOICE_tap === true ){option_button_VOICE.x=cur.position.x-option_button_VOICE.width;option_button_VOICE.alpha=0.5}else{option_button_VOICE.alpha=1};

//音量ボタン位置の上限下限
if(option_button_BGM.x < wid/5 ){option_button_BGM.x=wid/5+wid/30};
if(option_button_BGM.x > wid-wid/5){option_button_BGM.x=wid-wid/5-wid/30};
if(option_button_SE.x < wid/5 ){option_button_SE.x=wid/5+wid/30};
if(option_button_SE.x > wid-wid/5){option_button_SE.x=wid-wid/5-wid/30};
if(option_button_VOICE.x < wid/5 ){option_button_VOICE.x=wid/5+wid/30};
if(option_button_VOICE.x > wid-wid/5){option_button_VOICE.x=wid-wid/5-wid/30};

// ------------------------------------------------------------
// 手が画面端についた
// ------------------------------------------------------------
//Y
if(handY + handheight > cameraheight || handY - handheight/2 < 0 ){

};
   


// ------------------------------------------------------------
//Game Start once EVENT
// ------------------------------------------------------------

if(passtime===0){
ballX=befballX=ballY=befballY=0;
if(SEon === true){
stroke.play()
};
};
if(beforex == cur.position.x  &&  beforey == cur.position.y ){moving=false}//else{moving=true}


/*毎秒処理 every frame fst */ 
movexy=Math.abs(movex) + Math.abs(movey);
tapmovexy=Math.abs(tapmovex) + Math.abs(tapmovey);
passtime++;
if(tapcount > 0){gametime++};
degree = degree + 1
radian = degree * Math.PI
updown = Math.sin(radian) * 10


//rippleefect.rotation=cur.rotation;


emptyAnimation.evaluate = function (time, weight, blend, target) {
let p = target.parameters.values;




if(tapcount === 0  ){


// ------------------------------------------------------------
// カメラの許可UI
// ------------------------------------------------------------
//https://u-site.jp/alertbox/permission-requests
//カメラの許可をすると、どんな価値のあることが得られるのかを提示する
//→アクセス許可要求を読むとき、ユーザーはそれとなく費用便益分析をおこなっている。
//専門用語を使わない　
//UXの文言は意思決定を促すscript

// ------------------------------------------------------------
// チュートリアル　tutorial
// ------------------------------------------------------------

//離してるとdef値に戻ろうとする
title_body.y+=((hei-title_body.height/2)-title_body.y)*0.1//1
if(title_body.y < hei-title_body.height/2+hei/20){//2
title_tablet.x+=(wid/2-title_tablet.x)*0.1;
title_tablet.y+=(hei/2-title_tablet.y)*0.1;
if(title_tablet.y < hei/2+hei/60){//3

title_allowcamera.alpha+=(1-title_allowcamera.alpha)*0.1;

};

};

title_allowcamera.x=title_tablet.x+hei/10;
title_allowcamera.y=hei/2;

if(title_allowcamera.alpha > 0.8 ){
title_tap.y+=(hei*1.26-title_tap.y)*0.1;
	if(title_tap.y < hei*1.26+hei/200 ){
	title_tap.visible=false;
	title_allowcamera.texture=tapstart;
	title_allowcamera.width=387*hei/700;
	title_allowcamera.height=57*hei/700;
	title_allowcamera.alpha=0.7+first_fap/100

	};
};



title_tap.x=title_allowcamera.x+hei/3.8;

title_stick.x=title_tablet.x;
title_stick.y+=((hei-title_body.height*2)-title_stick.y)*0.1;
title_hand.x=title_stick.x+hei/17;


if(title_tap.visible === false && gametime === 0 ){

title_stick.visible=title_hand.visible=true;

p[Y]=first_fap/2.5-20;

p[BstRY]=p[BstLY]=p[Y]*-1;
p[Man]=first_fap/2.5


}else{
title_stick.visible=title_hand.visible=false;

};

first_fap=Math.abs(Math.sin(passtime*5 * Math.PI/180))*50;

title_hand.y=title_body.y-hei/20+first_fap;



model.alpha=0.8
if(passtime %  13 === 0){model.alpha=0.85};
if(passtime %  17 === 0){model.alpha=0.82};

}

if(gametime > 0){

if(gametime === 1){//ゲーム開始時一度だけの処理
//タイトル・オプション画像の破棄
app.stage.removeChild(titles,optionparts,optionbutton,notes);

};

titlezoom=0;
titles.alpha+=(0-titles.alpha)*0.15;

model.alpha+=(modelalpha-model.alpha)*0.1;
if(modelfilter_on === 1){
modelfilter.bloomScale+=(0.25-modelfilter.bloomScale)*0.1;
modelfilter.brightness=0.8+(p[Y]*-0.003);
modelfilter2.rotation=35-p[Y]*3;
};




//┏━━━━━━━━━━━━━━━移動式━━━━━━━━━━━━━━━━━━┓


//あまりにも大きい値の場合変に激しく動くので
//移動量を減らす
if(handyY > 12 ){ handyY=12+handyY/100};

befTMX=TMX;//TMX = Total Move X
TMX=handyX/10+tapmovex/10*-1//*(1.5/*-Math.abs(TMXavg)*/);
befTMY=TMY;//TMY = Total Move Y
//TMY=handyY/(btY*4)+tapmovey/10*-1//*(1.5/*-TMYavg*/);
TMY=handyY/(8+btY/2)+tapmovey/10*-1//*(1.5/*-TMYavg*/);

//------------------------------------------------------------------
//MOVE Direction----------------------
//------------------------------------------------------------------

if(handin_time > -2){//前提として、手が画面内にある時のみの処理


if(befTMY > 0 && TMY > 0 ){
if(sameDY < 0){sameDY=0};

sameDY++;handyY_total+=handyY;
}else// sameDY=same direction Y
if(befTMY < 0 && TMY < 0 ){
if(sameDY > 0){sameDY=0};
sameDY--;handyY_total+=handyY;



}else{



if(Math.abs(sameDY) > 3 && Math.abs(handyY_total) > 15 /* && Math.abs(handyY_total) > 6-deltaTimeSeconds*deltaTimeSeconds && btY > 0.5-ToySpeedv*/  ){//チェンジ時条件 Y軸が同じ方向へ3フレーム以上動いた
if(sameDY !== 0){//切り替わり時、一度だけの処理
eye_close=handyY_total=0;//強制まばたきとhandyYの移動量のリセット
Brow_potision=1;
MoveDirectionY_ChangeCount++;//Direction change(方向転換)
shake_count++;//上下動が切り替わったときにカウントするストップウォッチ用変数
};




if(MoveDirectionY_ChangeCount % 2 === 0 ){//偶数はtopY,奇数はbottomYの値を取得
deftopY=topY;//前フレームの値を上限に代入
deftopX=topX
topY=(handY+deftopY)/2
topY=deftopY*0.9+handY*0.1;//前フレームとの平均値を上限とする
topX=(handX+deftopX)/2;
}else{
defbottomY=bottomY;//前フレームの値を下限に代入
defbottomX=bottomX;
topY=(handY+defbottomY)/2;
topY=defbottomY*0.9+handY*0.1;//前フレームとの平均値を下限とする
bottomX=(handX+defbottomX)/2;
};

if(topY > bottomY ){//もし下限より上限の方が大きくなってしまったら、値を入れ替える

[topY, bottomY] = [bottomY, topY];//分割代入を使った値の交換 ES2015で可能

};


defbtY=btY;
btY=((bottomY-topY)+defbtY)/2;
btY=(btY+btY)/2;//しつこいくらいに中間の値を取得
//BtY mini FAP=0-3 camera giri in FAP=15-20?
};//チェンジ時条件 END

sameDY=0;
};//Move_direction_change END

}else{//if(handin_time > 0){
btY=1;



};




//手がカメラ内にあるときに、画面をタップするとキャラが半透明になり、
//カメラに映っている映像が見えやすくなります。
if(tap > 0 && handin_time > -1 && handin_count > 0){modelalpha=0.2}else{modelalpha=1};



//┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

//平均値
//前フレームの値を90%に減らした後、新しい値を10%足す　水槽の水換えみたいに
TMXavg=TMXavg*0.9;
TMXavg+=TMX*0.1;
TMYavg=TMYavg*0.9;
TMYavg+=TMY*0.1;

TMXY=Math.abs(TMX)+Math.abs(TMY);




//ZoomBlur power&state-----------------------------------------------


//modelfilter_zb.visible=false;
/*
if(TMY > 0 ){modelfilter_zb_state=0};
if(TMY < 0 ){modelfilter_zb_state=hei};
modelfilter_zb.center = [wid/2, modelfilter_zb_state]
modelfilter_zb.strength=Math.abs(TMY)/1000;
*/
//tensionup-----------------------------------------------
if(gametime > 0 ){tensionup=TMXY/20};
if(tensionup > 2 ){tensionup=2};




//カメラの前で静止している時間
if(TMXY < 0.5){
cameramovestoptime++;
}else{cameramovestoptime=0};

///3秒以上放っておくと興奮が静まっていきます。
if(tap <  tensiondowntime*60*-1 && 0 <= tension && cameramovestoptime > 30){
playerstop=true}else{playerstop=false
};



if(playerstop === true){
//待機中らしいモーション
//具体的なセリフとか(どきどきする…てきな)
tensionup=tensiondown*-1;
};


//https://qiita.com/yfujii1127/items/feb0cabc9e6b003924b4 最大最小の書き方
//Math.max(0, Math.min(100,tension + tensionup));

if(tension+tensionup <= 100 ){
tension+=tensionup;
};

//挿入汁噴出
if(Math.abs(sameDY) === 1  && p[DripAlpha] < 0.1 ){

BstRYpower=Math.random()*(0.6 - (0.4)) + (0.4);
BstLYpower=BstRYpower+Math.random()*(0.3 - (-0.3)) + (-0.3);

p[DripX]=(Math.random()*(1 - (-1)) + (-1));
p[Drip]=0;
p[DripAlpha]=1;
};
p[Drip]+=(1-p[Drip])*0.1;
p[DripAlpha]+=(0-p[DripAlpha])*0.03;
if(p[DripAlpha] < 0.2){p[DripAlpha]-=0.3};

//x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=
//TMXX/XYを直読みするLive2Dパラメーター-------------------------------
//x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=

//押す↑時は息子で押すのでManパラメーターを最速
//↓の時は胸(と若干の胴体)を紐を引っ張っているのでBSTで直読み
//他パーツは直読みせず、その時直読みしているパラメーターに応じて、追従するように動く

///↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
if(TMY > 0){
if(p[Man]+TMY <= 10){ 
p[Man]+=TMY;
//男性器が深く挿入されている=おっぱいがちょっと左右にずれて棒が入ってる感を出す
p[BstRX]+=(p[Man]/-4-p[BstRX])*0.05;
p[BstLX]+=(p[Man]/4-p[BstLX])*0.05;
};
p[Y]+=(p[Man]*-1-p[Y])*0.1;
};

///↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
if(TMY < 0){
if(p[Y]+TMY*-1 > -10){ 
p[Y]+=TMY*-1;
};
p[Man]+=(p[Y]*-1-p[Man])*0.1;
};

//*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。
//胸X
//*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。


//手の動く方向と連動

if(Math.abs(p[BstRX]) - Math.abs(TMX) < 10  && Math.abs(p[BstRX]) - Math.abs(TMX) > -10 ){
p[BstRX]-=TMX;
p[BstLX]-=TMX;
};

//gripが強いほど、強く握っている=締め付けが強い=おっぱいが中央寄り
if(Bstgrip + grip/5 < 10 && Bstgrip + grip/5 > -10 ){
Bstgrip+=grip/5;
};

p[BstRX]+=(Bstgrip*-1-p[BstRX])*0.05;
p[BstLX]+=(Bstgrip-p[BstLX])*0.05;

//*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。
//胸Y
//*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。*・。

//手のXの動きがある=上下に大きくしごくのではなく、
//手先でちょこちょこ弄っている=おっぱいの左右を互い違いに上下させるごしごしモード

//左胸Yと右胸Yの動きはあえてちょっとずらす
p[BstRY]+=(p[Y]-p[BstRY])*BstRYpower;
p[BstLY]+=(p[Y]-p[BstLY])*BstLYpower;


//━─━─━─━─━─━─━─━─━─━─━─━─━─━─━─━─━─━
//Z
//━─━─━─━─━─━─━─━─━─━─━─━─━─━─━─━─━─━


p[Z]+=aX/100;




//呼吸モーション
Breathtime+=0.6+TMXY/3;//激しく動かすほど呼吸が荒くなる
p[Breath]=Math.abs(Math.sin(Breathtime * Math.PI/180));
//びくびくモーションは呼吸モーションを急激に変化させることで対応?
//p[Breath]=p[Breath]/2









//頭&肩------------------------------------------
//1.XYと連動する動き//1.XYと連動する動き//2.キャラ自らが置こうとしている頭の位置(定期的に変更)
p[HeadY]+=((p[Y]*1.5+HeadYstate)-p[HeadY])*speedFR*1.5;
p[HeadX]+=((p[Z]*3+HeadXstate)/2-p[HeadX])*speedFR*1.5;
p[HeadZ]+=((p[Z]*3+HeadZstate)/2-p[HeadZ])*speedFL*1.5;

//左右スピードのゆらぎを設定

if(passtime % 100 === 0 ){

speedFR=Math.random()*(0.45 - (0.4)) + (0.4);
speedFL=Math.random()*(0.45 - (0.4)) + (0.4);

};


if(Headstate_changetime < 0){

HeadYstateto=(Math.random()*(25 - (-25)) + (-25));
HeadXstateto=(Math.random()*(20 - (-20)) + (-20))+tension/10;//tensionによる首ののけぞり表現加算
HeadZstateto=HeadYstate+(Math.random()*(10 - (-10)) + (-10));


Headstate_changetime=(Math.random()*(Headstate_changetime_def - (Headstate_changetime_def/2)))

};

HeadYstate+=(HeadYstateto-HeadYstate)*0.1;
HeadXstate+=(HeadXstateto-HeadXstate)*0.1;
HeadZstate+=(HeadZstateto-HeadZstate)*0.1;

Headstate_changetime-=1;






//目を数秒閉じで快感を感じている様子

if(passtime % 1000-Math.round(tension)*3 === 0 ){motion_mode=1;//テンションが上がるほど入りやすくなる
//目を閉じている時間のランダム化
if(Math.round(tension) % 3 === 0 ){shakehead=90};
if(Math.round(tension) % 7 === 0 ){shakehead=120};
shakehead=60;

if(Math.round(tension) % 5 === 0 ){motion_mode=0};//時々キャンセル入る

};


if(shakehead > 0 &&  motion_mode ===1 ){

eye_close=0;
shakehead-=1;
};

//②小さ目に首振りつつ、首ふり幅を収束しながら肩をこわばらせる------------------
//シャニマスむんさんの頬に手を当てるモーションを参考
if(passtime % 1000 === 0 &&  tension < 50 &&   tension > 30  ){
motion_mode=2;
if(Math.round(tension) % 3 === 0 ){shakehead=50};
if(Math.round(tension) % 7 === 0 ){shakehead=67};
shakehead=45;
if(Math.round(tension) % 5 === 0 ){motion_mode=0};//時々キャンセル入る

p[HeadY]=20;
};

if(shakehead > 0 &&  motion_mode ===2  ){
p[HeadX]+=(Math.sin(passtime*20 * Math.PI/180)*shakehead-p[HeadX])*0.9;
p[HeadZ]+=(p[HeadX]/2-p[HeadZ])*0.5;
p[HeadY]+=(10-p[HeadY])*0.1;

p[SRY]+=(10-p[SRY])*Math.abs(shakehead/100);
p[SLY]+=(10-p[SLY])*Math.abs(shakehead/100);

eye_close=0;
shakehead-=1;
};
//③首振り ------------------


if(passtime % 1500 === 0 &&  tension > 49  ){
motion_mode=3;

shakehead=45;
if(Math.round(tension) % 2 === 0 ){shakehead=40};

};

if(shakehead > 0 　&&  motion_mode === 3 ){
p[HeadX]+=(Math.sin(passtime*20 * Math.PI/180)*40-p[HeadX])*0.9;
p[HeadZ]+=(p[HeadX]/2-p[HeadZ])*0.5;
p[HeadY]+=(-20-p[HeadY])*0.6;

eye_close++;
p[EYE_L_OPEN]+=(0.5-p[EYE_L_OPEN])*0.8;
p[EYE_R_OPEN]+=(0.5-p[EYE_R_OPEN])*0.8;

shakehead-=1;
};


//モーションモードのリセット
if(shakehead < 0){motion_mode=0};


//肩------------------------------------------
//X-押すほど肩が外側に開く
p[SRY]+=(p[Y]/1.2-p[SRY])*(0.01+earrspeed/60)
p[SLY]+=(p[Y]/1.2-p[SLY])*(0.01+earlspeed/60)


p[SRX]+=((p[Y]*-1)/4-p[SRX])*0.02;
p[SLX]=p[SRX]*-1;



//口------------------------------------------
mouthform=-0.75+tension/75*2;
//目閉じ俯き快感食いしばり------------------
if(tension > 50){
if(passtime % 1000 === 0  ){
endure=45;
};
};

if(endure > 0 ){

p[HeadY]+=(-25-p[HeadY])*0.6;

p[EYE_L_OPEN] += (0-p[EYE_L_OPEN])*0.5;
p[EYE_R_OPEN] += (0-p[EYE_R_OPEN])*0.4;

mouthform=-0.8
mouthopen=0.6

endure-=1;

};//------------------

//すごく小さく口を開こうとすると口が見えないレベルで小さくなるので強制閉じ
if(mouthopen < 0.15){mouthopen=0};

p[MouthOpen]+=(mouthopen-p[MouthOpen])*0.4;
p[MouthForm]+=(mouthform-p[MouthForm])*0.4;

};//gametime0

//モデルの位置・サイズ-----------------------------------------------

model.x+=((modeldefx+aX)-model.x)*0.01;
model.y+=((modeldefy-zoom*150+aY+modelusery+p[Y]*-hei/300)/*+(YY/10)*/-model.y)*0.05;

model.scale.x+=(((hei*zoom)-(hei*titlezoom))-model.scale.x)*0.1
model.scale.y=model.scale.x;

//位置を定期的に変えるだけでなく微妙に動き続けないと人間っぽくないかもと思ったので、
//rotationを微動させる

//model.rotation=

//StopWatch-----------------------------------------------




if(p[Count000] === 9 && p[Count00] === 9  && shake_count > 9 ){

}else{
if(shake_count > 9){
shake_count=0;
p[Count00]+=1;
}
if(p[Count00]> 9 ){
p[Count00]=0;
p[Count000]+=1;
};

p[Count0]=shake_count;

};//999の時


//Level 興奮度の高まりによる表情変化など ----------------------

p[Level]=tension/10;

p[Stain]=Stain/100;


//Level1 視線を合わせてくれるようになる

if(movexy < 30 && tap < 0){

EYE_X_potision=cur.position.x/wid*2-1;
EYE_Y_potision=cur.position.y/hei*2-1;

}else{//タップ視線操作していない

if(p[Level] > 1 ){

//テンションが上がると目玉までちょっとそれに釣られて上下する

if(p[HeadX] > 0){EYE_X_potision=0-p[HeadX]/300*-1}
if(p[HeadY] < 0){EYE_Y_potision=tension/300*p[Y]/300-p[HeadY]/300*-10}



}else{//Lv1 ↓　EYEXY OUT

if(p[HeadX] > 0){EYE_X_potision=0.7+p[HeadX]/300}
if(p[HeadX] < 0){EYE_X_potision=-0.7-p[HeadX]/300}

EYE_Y_potision=0.6;//うつむきがち
};


};

Brow_potision+=(0-Brow_potision)*0.2;

//下に引っ張ると乳首浮き出る
p[Nip]+=((((p[Y]+10)/40)*tension/200)-p[Nip])*0.5;
//上下MAX0.5+テンションMAX0.5　どっちもMAXでNipの値の最大である1になる
console.log(((p[Y]+10)/40)*tension/200)

if(p[Level] > 2 ){Cheek_potision=0.3};
if(p[Level] > 3 ){Brow_potision=-0.4;if(passtime %  4 === 0){p[Eyehi]=0};if(passtime %  3 === 0){p[Eyehi]=tension/100}}//瞳hiぷるぷる;
if(p[Level] > 4 ){Cheek_potision=0.5};
if(p[Level] > 5 ){Cheek_potision=1;p[Tear]+=(1-p[Tear])*0.1};
if(p[Level] > 6 ){Brow_potision=-1;p[Sweat]+=(1-p[Sweat])*0.1};
if(p[Level] > 7 ){Heart_potision=1}else{Heart_potision=0};

p[Heart]+=(1-p[Heart])*0.1;
p[Cheek]+=(Cheek_potision-p[Cheek])*0.1;
p[BrowL]+=(Brow_potision-p[BrowL])*0.1;
p[BrowR]+=(p[BrowL]-p[BrowR])*0.5;


//耳--------------------------------------------//
//左右動きに差をつける
if(passtime %  400 === 0){earrspeed=Math.floor(Math.random()*10)};//0-9
if(passtime %  300 === 0){earlspeed=Math.floor(Math.random()*10)}

p[EarR]+=((0-tension/15)-p[EarR])*(0.1+earrspeed/10);//tension上がるほど垂れ耳に
p[EarL]+=((0-tension/15)-p[EarL])*(0.1+earlspeed/10);





//目の内側の曲がり--------------------------//
if(passtime %  3 === 0){eye_smile++};
eye_smile=eye_smile.toString();//変数の数字を取得できるように変換

//10の位を取得⇒その値が7の時だけ目の内側をしかめる
if(eye_smile.substring(eye_smile.length - 2, eye_smile.length - 1) %　7　=== 0){
p[EYE_R_SMILE]+=(0-p[EYE_R_SMILE])*0.3;
p[EYE_L_SMILE]+=(0-p[EYE_L_SMILE])*0.3+(BstRYpower-BstLYpower)/2;

}else{
p[EYE_R_SMILE]+=(1-p[EYE_R_SMILE])*0.2;
p[EYE_L_SMILE]+=(1-p[EYE_L_SMILE])*0.3+(BstRYpower-BstLYpower)/2;
}

//------------------------↓Down↓tapplus--------------------------//
sidebutton.alpha+=(0-sidebutton.alpha)*0.1;
if(tap > 0 ){



//拡大縮小上下の位置調整
if(zoom_mode > 0 ){
zoom_v+=0.001;
if(zoom_mode === 1){zoom-=zoom_v/10};
if(zoom_mode === 2){zoom+=zoom_v/10};
if(zoom_mode === 3){modelusery-=zoom_v*40};
if(zoom_mode === 4){modelusery+=zoom_v*40};


sidebutton.alpha+=(0.5-sidebutton.alpha)*0.3;
if(zoom_v > 120){zoom_v=120};

if(cur.position.x > wid/10 && cur.position.x < wid-wid/10 && cur.position.y > hei/10 && cur.position.y < hei-hei/10){
zoom_mode=0;
};

};


//TapEffect
rippleefect.scale.x+=(5-rippleefect.scale.x)*0.008;
rippleefect.alpha+=(0-rippleefect.alpha)*0.1;
if(tap == 1 ){//タップ一度だけの処理
//const position = app.renderer.plugins.interaction.mouse.getLocalPosition(displayObject);
tapx=cur.position.x;
tapy=cur.position.y;

///時々かいしんのいちげきみたいな感じで、ランダムでポイントが2倍入る触り方ができるときがあります。
///その時は女の子がいつもより激しくビクっとします。
smash=Math.floor(Math.random() * (6 - 1)) + 1;//1-5のランダムを計算

};//tap === 1 END
tap++;
if(moving === false){tapnotmovingtime++}else{tapnotmovingtime=0};//カーソル動かさない
};//tapしている時

if(light.alpha < 0.9 ){light.alpha+=0.01};
//------------------------↑UP↑tapminus---------------------------//
if(tap < 0 ){
tap-=1;
rippleefect.scale.x=0;//波紋サイズとタップモードは離していると常に0;

//カーソル動かさない
if(moving === false ){cural=0};
cur.scale.x+=(curdefsize-cur.scale.x)*0.3;

};//tap === -1 End

eye_open_relax=tension/100;

//まばたきと吐息------------------------------------------------------
eye_close-=1;
eyes_partly_open--;
if(eyes_partly_open < -400 ){
eyes_partly_open=400;
}

if(eye_close < 4  ){
p[EYE_L_OPEN] += ((0.1-eye_open_relax)-p[EYE_L_OPEN])*0.8;//relaxが高い(最高0.1)程、U字っぽいリラックスした目閉じになる
p[EarR] += (10-p[EarR])*speedFR*2;
p[EarL] += (10-p[EarL])*speedFL*2;


//吐息
if(breath.alpha < 0.01){
breath.alpha=1;
if(p[Y] > 0) {breath.y=hei/2+p[Y]*hei/300}else{breath.y=hei/3}

breath.scale.x=0.2;
breath.x=model.x;
breathtox=Math.random()*(model.x+30 - model.x-30) + model.x-30;
}//吐息

}else{



//瞳閉じ
//テンション上がると瞼が下がりがち
if(eyes_partly_open < -400 ){
p[EYE_L_OPEN] += ((1-tension/1400)-p[EYE_L_OPEN])*0.3;
}else{//瞳が半分閉じたような状態に定期的になる
p[EYE_L_OPEN] += ((1-tension/400)-p[EYE_L_OPEN])*0.3;
};

breath.alpha+=(0-breath.alpha)*0.1;
breath.y-=5;
breath.scale.x=zoom;
breath.x+=(breathtox-breath.x)*0.3;
};

p[EYE_R_OPEN] += (p[EYE_L_OPEN]-p[EYE_R_OPEN])*0.9;

breath.scale.y=breath.scale.x;

if(eye_close < 0 ){eye_close=Math.floor(Math.random() * (200 - 800) + 200)}; 


player_shadow.y=hei/2+hei/3+p[Y]*-15;//プレイヤーの影(もどき)



//視線 ------------------------------------------------------------------------------------
//カーソルの移動量が落ち着いたら、ゆっくりと追いかける人間らしい視線の動きを心がける
p[EYE_X] += (EYE_X_potision-p[EYE_X])*0.05;
p[EYE_Y] += (EYE_Y_potision-p[EYE_Y])*0.05;

rippleefect.x=cur.x;rippleefect.y=cur.y;
rippleefect.scale.y=rippleefect.scale.x;

cur.alpha+=(cural-cur.alpha)*0.05;
cur.scale.y=cur.scale.x;

//エフェクトの位置指定につかうので、値を変数化しておく
pHeadX=p[HeadX];pHeadY=p[HeadY];

};//ParamEND-------------------------------------------------------------------------------------



//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//エフェクト関連
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

//ハートエフェクト heart effect-------------------
if(deltaTimeSeconds > 1.2){
sweatgroup.visible=false;

}else{
sweatgroup.visible=true;
//はぁとすぷらっしゅ
//if(passtime %  1200-Math.round(tension)*10 === 0 && heart.visible === false ){
if(passtime %  100 === 0){
heart.visible=true;
heartcount++;
heart.alpha=0.01+Math.random()*(0.01 - (0) + (0));

if(heartcount %  2 === 0 ){
heart.x=wid/2+hei/5+Math.random()*(hei/100 - (-1*hei/100)) + (-1*hei/100);
heart.rotation=Math.random()*(0.5 - (0.35)) + (0.35);
}else{
heart.x=wid/2+hei/5*-1+Math.random()*(hei/100 - (-1*hei/100)) + (-1*hei/100);
heart.rotation=Math.random()*(-0.5 - (-0.35)) + (-0.35);
};

heart.y=hei/2+Math.random()*(hei/4 - (-1*hei/4)) + (-1*hei/4);

};

//if(passtime %  1400-Math.round(tension)*10 === 0 && heart2.visible === false ){
if(passtime %  120 === 0){
heart2.visible=true;
heartcount++;

heart2.alpha=0.01+Math.random()*(0.01 - (0) + (0));

if(heartcount %  2 === 0 ||　heartcount %  7 === 0 ){//時々左右連続で同じ方からでる
heart2.x=wid/2+hei/5+Math.random()*(hei/100 - (-1*hei/100)) + (-1*hei/100);
heart2.rotation=Math.random()*(0.5 - (0.35)) + (0.35);
}else{
heart2.x=wid/2+hei/5*-1+Math.random()*(hei/100 - (-1*hei/100)) + (-1*hei/100);
heart2.rotation=Math.random()*(-0.5 - (-0.35)) + (-0.35);
};

heart2.y=hei/2+Math.random()*(hei/4 - (-1*hei/4)) + (-1*hei/4);

};

//if(passtime %  1500-Math.round(tension)*10 === 0 && heart3.visible === false ){
if(passtime %  140 === 0){
heart3.visible=true;
heartcount++;

heart3.alpha=0.01+Math.random()*(0.01 - (0) + (0));

if(heartcount %  2 === 0 ){
heart3.x=wid/2+hei/5+Math.random()*(hei/100 - (-1*hei/100)) + (-1*hei/100);
heart3.rotation=Math.random()*(0.5 - (0.35)) + (0.35);
}else{
heart3.x=wid/2+hei/5*-1+Math.random()*(hei/100 - (-1*hei/100)) + (-1*hei/100);
heart3.rotation=Math.random()*(-0.5 - (-0.35)) + (-0.35);
};

heart3.y=hei/2+Math.random()*(hei/4 - (-1*hei/4)) + (-1*hei/4);

};

heart.rotation+=heart.rotation/300;
heart.x+=heart.rotation*3.4+TMXY;
heart.y+=(hei/5-heart.y)*0.01;
heart.alpha+=0.007+TMXY/100;

heart2.rotation+=heart2.rotation/270;
heart2.x+=heart2.rotation*3.4+TMXY;
heart2.y+=(hei/5-heart2.y)*0.01;
heart2.alpha+=0.007+TMXY/90;

heart3.rotation+=heart3.rotation/330;
heart3.x+=heart3.rotation*3.4+TMXY;
heart3.y+=(hei/5-heart3.y)*0.01;
heart3.alpha+=0.007+TMXY/110;

if( heart.alpha > 0.99){heart.visible=false};
if( heart2.alpha > 0.99){heart2.visible=false};
if( heart3.alpha > 0.99){heart3.visible=false};

};


//汗エフェクト sweat effect-------------------

if(TMXY > 0.5 && sweatface.alpha < 0.1){

sweatface.x=model.x;sweatface.y=hei/4;
sweatarmpitr.x=model.x-wid/6;sweatarmpitr.y=hei/2;
sweatarmpitl.x=model.x+wid/6;sweatarmpitl.y=sweatarmpitr.y;
sweatBstr.x=model.x-wid/8;sweatBstr.y=hei/2+hei/4;
sweatBstl.x=model.x+wid/8;sweatBstl.y=sweatBstr.y;


sweatface.width=sweatface.height=hei/2;
sweatarmpitr.width=sweatarmpitr.height=hei/6;
sweatarmpitl.width=sweatarmpitl.height=hei/6;
sweatBstr.width=sweatBstr.height=hei/6;
sweatBstl.width=sweatBstl.height=hei/6;


sweatface.rotation=Math.random()*(180 - (-180)) + (-180);
sweatarmpitr.rotation=Math.random()*(180 - (-180)) + (-180);
sweatarmpitl.rotation=Math.random()*(180 - (-180)) + (-180);
sweatBstr.rotation=Math.random()*(180 - (-180)) + (-180);
sweatBstl.rotation=Math.random()*(180 - (-180)) + (-180);

sweatface.alpha=0.2
sweatarmpitr.alpha=sweatarmpitl.alpha=sweatBstr.alpha=sweatBstl.alpha=1;

};
sweatmoveX=(TMX+pHeadX)/40;
sweatmoveY=(TMY+pHeadY)/40;


//xy
sweatface.x+=sweatmoveX;
sweatface.y+=sweatmoveY;
sweatarmpitr.x+=sweatmoveX;
sweatarmpitr.y+=sweatmoveY;
sweatarmpitl.x+=sweatmoveX;
sweatarmpitl.y+=sweatmoveY;
sweatBstr.x+=sweatmoveX;
sweatBstr.y+=sweatmoveY;
sweatBstl.x+=sweatmoveX;
sweatBstl.y+=sweatmoveY;

//alpha 
sweatface.alpha+=(0-sweatface.alpha)*Math.abs(sweatface.rotation)/1000;
sweatarmpitr.alpha+=(0-sweatarmpitr.alpha)*Math.abs(sweatarmpitr.rotation)/1000;
sweatarmpitl.alpha+=(0-sweatarmpitl.alpha)*Math.abs(sweatarmpitl.rotation)/1000;
sweatBstr.alpha+=(0-sweatBstr.alpha)*Math.abs(sweatBstr.rotation)/1000;
sweatBstl.alpha+=(0-sweatBstl.alpha)*Math.abs(sweatBstl.rotation)/1000;

//with&height
sweatface.width+=(hei/2*1.5-sweatface.width)*0.1;
sweatface.height=sweatface.width;

sweatarmpitr.width=sweatarmpitl.width=sweatface.width/2*0.75;
sweatarmpitr.height=sweatarmpitl.height=sweatarmpitr.width;

sweatBstr.width=sweatBstl.width=sweatface.width/1.5*0.75;
sweatBstr.height=sweatBstl.height=sweatBstr.width;

//・…………・…………・…………・…………・…………・…………・…………
//------------------------BGM--------------------------
//・…………・…………・…………・…………・…………・…………・…………
if(BGMon === true && gametime === 1){
bgm.volume(BGM_volume)
bgm.play();
};
//BGMのボリュームは操作量に応じてゆったりと変化 たくさん動かすと音量が小さくなる
if(BGMon === true){
bgm.volume(BGM_volume-TMXY/100);
};
//・…………・…………・…………・…………・…………・…………・…………
//------------------------SE--------------------------
//・…………・…………・…………・…………・…………・…………・…………

if(SEon === true  ){

//water------------------------
waterrandom=1+Math.floor(Math.random()*9);

	if(sameDY === -1){
	insertSE.play("down" + waterrandom);console.log("down" + waterrandom);
	};

	if(sameDY === 1){
	insertSE.play("up" + waterrandom);console.log("up" + waterrandom);
	};

//stroke------------------------

strokev+=((TMXY/10*SE_volume)-strokev)*0.4;
if(strokev > 1 ){strokev=1};
stroke.volume(strokev)
if(passtime %  4 === 0){};



};//SEon


//・…………・…………・…………・…………・…………・…………・…………
//------------------------VOICE--------------------------
//・…………・…………・…………・…………・…………・…………・…………
if(VOICEon === true  ){

////------------------------VOICE MOUTH
if( TMXY > 3){
//------------------------VOICE
//if(breathEND === true && VOICEon === true){

//基本↓動き(挿入)して止まった瞬間にあっあっ、と喘いで
//抜く動作の時は声を出さない

//３、４回あっあっ、が続いたらパターン違いとして
//3~4前後動分くらいの時間をかけた長い喘ぎパターンを入れる


//セリフに近いボイスパターンもあり
//ボイスの尺分の独自のモーションも交えて行う


if(mouthopen < 0.1){
breathrandom=1+Math.floor(Math.random()*10);
//sounds.play("breath" + breathrandom);
voices.play("sigh2")
voices.volume(VOICE_volume)
//breathEND=false;

};
mouthopen=0.5;
}else{
mouthopen+=(0-mouthopen)*0.1;
};



//STOP VOICE


/*
if(breathEND === true && VOICEon === true){
laughrandom=1+Math.floor(Math.random()*8);
sounds.play("laugh" + laughrandom);
breathEND=false;


};
*/


//SOUND TEST
/*
if(VOICEon === true && breathEND === true){
++soundcount;
if(soundcount === 15 ){soundcount=1};
console.log("VoiceCheck" + soundcount);
sounds.play("breath" + soundcount);
breathEND=false;
}
*/
};



//*---*---*---*---*---*---*---*---*---*---*---*---*---*---*---*---*---*
//DEBUG デバッグ関連
//*---*---*---*---*---*---*---*---*---*---*---*---*---*---*---*---*---*

//MoveDirectionY_ChangeCount
if(word_debug === true ){
 txt.text = "handin_time: " + handin_time + " sameDY: " + Math.round(sameDY) + "topY:" +  Math.round(topY) + "bottomY:" +  Math.round(bottomY)
};

        });


function onPointerMove(eventData)
{
//window in
if(eventData.data.global.x < 0){eventData.data.global.x=0};
if(eventData.data.global.x > wid){eventData.data.global.x=wid};
if(eventData.data.global.y < 0){eventData.data.global.y=0};
if(eventData.data.global.y > hei){eventData.data.global.y=hei};

//カーソル動かす
moving=true;//true
movex=eventData.data.global.x - cur.position.x;movey=eventData.data.global.y - cur.position.y;
cur.position.x = eventData.data.global.x;cur.position.y = eventData.data.global.y;



beforex=eventData.data.global.x;beforey=eventData.data.global.y;
cural=1;
//tapmove x&y about max=1 min=-1
if(tap > 0 ){
tapmovex=movex;
tapmovey=movey;

};


};


 function onResize(event) {
            if (event === void 0) { event = null; }
//------Resize------//


wid=window.innerWidth;
hei=window.innerHeight;
modeldefx=wid/2;modeldefy=hei/2+hei/3.2;



console.log( "Resize Window !! W:" + wid + "H:"+ hei );
app.view.style.width = wid + "px";app.view.style.height = hei + "px";
app.renderer.resize(wid, hei);


sweatface.x=model.x;sweatface.y=hei/4;
sweatarmpitr.x=model.x-wid/6;sweatarmpitr.y=hei/2;
sweatarmpitl.x=model.x+wid/6;sweatarmpitl.y=sweatarmpitr.y;
sweatBstr.x=model.x-wid/8;sweatBstr.y=hei/2+hei/4;
sweatBstl.x=model.x+wid/8;sweatBstl.y=sweatBstr.y;



dark.width=light.width=player_shadow.width=wid;
dark.height=light.height=player_shadow.height=hei;

player_shadow.x=wid/2;

//title option

title_body.width=wid;
title_body.height=hei/10;
title_body.x=wid/2;


title_stick.width=hei/5*1.03;
title_stick.height=hei/4*3;

title_hand.width=hei/5*2.2;
title_hand.height=hei/4*2.2;

title_tablet.width=title_tablet.height=hei;


title_allowcamera.width=title_allowcamera.height=hei/3;

title_tap.width=607*hei/600
title_tap.height=809*hei/600

option_button_BGM.width=option_button_BGM.height=hei/10;
option_button_SE.width=option_button_SE.height=hei/10;
option_button_VOICE.width=option_button_VOICE.height=hei/10;


optionbutton.x=wid/2+wid/12;
optionbutton.y=hei/10;
optionbutton.width=optionbutton.height=hei/10;

option_button_BGM.y=hei/2-hei/4;
option_button_SE.y=hei/2
option_button_VOICE.y=hei/2+hei/4;

soundPath_BGM.y=option_button_BGM.y+option_button_BGM.height/2;
soundPath_SE.y=option_button_SE.y+option_button_SE.height/2;
soundPath_VOICE.y=option_button_VOICE.y+option_button_VOICE.height/2;

optionBGM.y=option_button_BGM.y+option_button_BGM.height/2;
optionSE.y=option_button_SE.y+option_button_SE.height/2;
optionVOICE.y=option_button_VOICE.y+option_button_VOICE.height/2;

soundPath_BGM.x=soundPath_SE.x=soundPath_VOICE.x=wid/1.5-wid/9.8;


soundPath_BGM.width=soundPath_SE.width=soundPath_VOICE.width=wid/1.9;
soundPath_BGM.height=soundPath_SE.height=soundPath_VOICE.height=hei/60;

lens.width=wid;lens.height=hei;
lens.x=wid/2;lens.y=hei/2;

optionBGM.x=optionSE.x=optionVOICE.x=wid/6;

optionBGM.scale.x=optionSE.scale.x=optionVOICE.scale.x=hei/1000
optionBGM.scale.y=optionSE.scale.y=optionVOICE.scale.y=hei/1000

heart.width=heart.height=heart2.width=heart2.height=heart3.width=heart3.height=hei/20;

//video.width=wid;video.height=hei;//変化ないっぽい

//title_tablet.scale = new PIXI.Point(0.5 , 0.5); 優先されない

//拡縮しても大丈夫っぽいモデル位置
model.position = new PIXI.Point((wid * 0.5), (hei * 0.54));
model.scale.x=(hei*zoom)-(hei*titlezoom)

        };

        window.onresize = onResize;

function toggleFullScreen() {
fullsc++;
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
  }
}

//全体角度・位置
        const Y = model.parameters.ids.indexOf("ParamBodyAngleY");//《2》10
        const Z = model.parameters.ids.indexOf("ParamBodyAngleZ");//《2》10
//顔
        const HeadX = model.parameters.ids.indexOf("ParamAngleX");//左右を向く《3》
        const HeadY = model.parameters.ids.indexOf("ParamAngleY");//上下を向く《4》
        const HeadZ = model.parameters.ids.indexOf("ParamAngleZ");//首の傾き《5》
//目・瞳
        const EYE_R_OPEN = model.parameters.ids.indexOf("ParamEyeROpen");//右目開き
        const EYE_L_OPEN = model.parameters.ids.indexOf("ParamEyeLOpen");//左目開き
        const EYE_X = model.parameters.ids.indexOf("ParamEyeBallX");//目玉X
        const EYE_Y = model.parameters.ids.indexOf("ParamEyeBallY");//目玉Y
        const EYE_R_SMILE = model.parameters.ids.indexOf("ParamEyeRSmile");//右目睨みつけ
        const EYE_L_SMILE = model.parameters.ids.indexOf("ParamEyeLSmile");//左目睨みつけ
        const Eyehi = model.parameters.ids.indexOf("Eyehi");//瞳うるうる
//眉
        const BrowL = model.parameters.ids.indexOf("ParamBrowLAngle");//《10》-1-0-1
        const BrowR = model.parameters.ids.indexOf("ParamBrowRAngle");//《10》-1-0-1
//胸 Bst
        const BstRX = model.parameters.ids.indexOf("ParamRBstX");//右胸左右//【R】LeftRight
        const BstRY = model.parameters.ids.indexOf("ParamRBstY");//右胸上下//【R】UpDown
        const BstLX = model.parameters.ids.indexOf("ParamLBstX");//左胸左右//【L】LeftRight
        const BstLY = model.parameters.ids.indexOf("ParamLBstY");//左胸上下//【L】UpDown
        const Nip = model.parameters.ids.indexOf("Nip");//《10》0-1
        const Man = model.parameters.ids.indexOf("ParamMan");//《10》0-1
//肩
        const SRX = model.parameters.ids.indexOf("ParamShoulderRX");//右肩X
        const SRY = model.parameters.ids.indexOf("ParamShoulderRY");//右肩Y
        const SLX = model.parameters.ids.indexOf("ParamShoulderLX");//左肩X
        const SLY = model.parameters.ids.indexOf("ParamShoulderLY");//左肩Y


        const Cheek = model.parameters.ids.indexOf("ParamCheek");//頬 
        const Tear = model.parameters.ids.indexOf("Tear");//涙


        const EarR = model.parameters.ids.indexOf("EarR");//右耳
        const EarL = model.parameters.ids.indexOf("EarL");//左耳

//Mouth
        const MouthOpen = model.parameters.ids.indexOf("ParamMouthOpenY");//口 開閉
        const MouthForm = model.parameters.ids.indexOf("ParamMouthForm");//口　変形
        const Breath = model.parameters.ids.indexOf("ParamBreath");//呼吸(胸を中心にもわ～って広がるやつ)《26》


   const Heart = model.parameters.ids.indexOf("Heart");//瞳のハートの濃度 
   const Sweat = model.parameters.ids.indexOf("Sweat");//顔の汗とよだれ

//ストップウォッチ StopWatch
   const Count0 = model.parameters.ids.indexOf("Count0");//1の位
   const Count00 = model.parameters.ids.indexOf("Count00");//10の位
   const Count000 = model.parameters.ids.indexOf("Count000");//100の位
   const Level = model.parameters.ids.indexOf("Level");//右のランプの点灯数

   const Stain = model.parameters.ids.indexOf("Stain");//シーツの染み

   const Drip = model.parameters.ids.indexOf("Drip");//挿入汁の放物線
   const DripAlpha = model.parameters.ids.indexOf("DripAlpha");//挿入汁の透明度
   const DripX = model.parameters.ids.indexOf("DripX");//挿入汁の位置

   const Drip2 = model.parameters.ids.indexOf("Drip2");//挿入汁の放物線

          model.animator.getLayer("Drag").play(emptyAnimation);
    });