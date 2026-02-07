"use strict";

// ファミコン本体クラス
var NES = require('./NES');

// canvas
var canvas = document.getElementById('mainCanvas');
var canvas_width = canvas.width;
var canvas_height = canvas.height;

var nes = new NES(canvas);

nes.initCanvas();

// キーボード取得 設定
window.onkeydown = function(e) { nes.handleKeyDown(e); };
window.onkeyup   = function(e) { nes.handleKeyUp(e); };

function nes_pause() {
	// Pause NES without touching UI (UI removed)
	return nes.Pause();
}


function nes_start() {
	// Start NES without touching UI (UI removed)
	return nes.Start();
}


// nes_reset removed (no UI controls present)


function nes_rom_change(arraybuffer) {
	// 実行中のNESを停止
	nes_pause();

	if( ! nes.SetRom(arraybuffer)) {
		console.error("Can't get rom data (perhaps you don't set ArrayBuffer arguments or it's not nes rom format)");
		return;
	}
	// Initialize and start the NES; do not touch absent UI elements
	if(nes.Init()) {
		nes_start();
		// ページ読み込み時にオーディオコンテキストをresumeを試みる
		try { nes.webAudioContextResume(); } catch (e) { /* ignore */ }
	}
}

// read_local_file removed (file input removed from UI)

// URL からROMを読み込み
var read_url = function (url, cb) {
	var request = new XMLHttpRequest();

	request.onload = function() { cb(request.response); };
	request.onerror = function(e) {
		console.error("can't get rom binary");
	};
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.send(null);
};

// 画面の高さに応じてcanvasサイズ変更
function resize_canvas() {
	var diameter = (parseInt)(window.innerHeight / canvas_height);
	canvas.style.width = canvas_width * diameter;
	canvas.style.height = canvas_height * diameter;
}


// fullscreen removed (no UI fullscreen button)

// DOMのイベントを設定
var initialize_dom_events = function() {
	// Only keep resize handling and audio resume hook; UI elements removed from HTML.
	window.addEventListener('resize', resize_canvas);

	var ontouchendEventName = typeof window.document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
	var resume_audio_func = function () {
		try { nes.webAudioContextResume(); } catch (e) { /* ignore */ }
		window.removeEventListener(ontouchendEventName, resume_audio_func);
	};
	window.addEventListener(ontouchendEventName, resume_audio_func);
};

// 初期化
window.onload = function() {
	// DOMのイベントを設定
	initialize_dom_events();

	// 画面の高さに応じてcanvasサイズ変更
	resize_canvas();

	// 最初のROMを自動読み込み
	var defaultRomUrl = './rom/smb.nes';
	read_url(defaultRomUrl, nes_rom_change);
};
