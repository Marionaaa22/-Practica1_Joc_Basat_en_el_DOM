var nFiles, nColumnes;
var ampladaCarta, alcadaCarta;
var separacio = 10;

var cartes = [];
var girades = [];
var clics = 0;
var maxClics;
var temps;

var ultimaCarta = null;

$(function () {

    iniciarJoc(2, 2);

});

function iniciarJoc(files, columnes) {

    nFiles = files;
    nColumnes = columnes;

    contarTemps(files, columnes, temps);

    clics = 0;
    $("#contador").text(clics);

    generarTauler();
    generarCartes();
    posicionarCartes();
}

function generarTauler() {
    $("#tauler").empty();

    for (let f = 0; f < nFiles; f++) {
        for (let c = 0; c < nColumnes; c++) {

            let carta = $(`
                <div class="carta" id ="f${f + 1}c${c + 1}">
                    <div class="cara darrera"></div>
                    <div class="cara davant"></div>
                </div>
            `);

            $("#tauler").append(carta);
        }
    }

    ampladaCarta = $(".carta").width();
    alcadaCarta = $(".carta").height();

    let ample = nColumnes * (ampladaCarta + separacio);
    let alt = nFiles * (alcadaCarta + separacio);

    $("#tauler").css({
        width: ample,
        height: alt
    });

    if($(".carta").on("click", girarCarta)){
        ultimaCarta = $(this).attr("id");

    }
}

function generarCartes() {

    let total = nFiles * nColumnes;
    let parelles = total / 2;

    let base = [];

    for (let i = 1; i <= parelles; i++) {
        base.push("carta" + i);
        base.push("carta" + i);
    }

    cartes = base.sort(() => Math.random() - 0.5);
}

function posicionarCartes() {

    let index = 0;
    $(".carta").each(function () {
        let f = Math.floor(index / nColumnes) + 1;
        let c = (index % nColumnes) + 1;

        $(this).css({
            "left": ((c - 1) * (ampladaCarta + separacio) + separacio) + "px",
            "top": ((f - 1) * (alcadaCarta + separacio) + separacio) + "px"
        });

        $(this).find(".davant").addClass(cartes[index]);
        index++;
    });
}

function girarCarta(ultimaCarta) {

    
    if ($(this).attr("id") === ultimaCarta) {
        return;

    } else {
        $(this).addClass("carta-girada");
        girades.push($(this));

        clics++;
        $("#contador").text(clics);

        if (girades.length === 2) {
            comprobarPareja();
        }

        // Reproducir un sonido cuando las Cartas se giran
        let sonido = new Audio('./so/ClickSound.mp3');
        sonido.play();

        
    }

    ultimaCarta = $(this).attr("id");
        console.log("Última carta girada: " + ultimaCarta);
}

function comprobarPareja() {

    let c1 = girades[0].find(".davant").attr("class");
    let c2 = girades[1].find(".davant").attr("class");

    if (c1 === c2) {
        setTimeout(() => {
            girades[0].fadeOut();
            girades[1].fadeOut();
            girades = [];
        }, 500);
        // Reproducir un sonido cuando las Cartas se giran
        let sonido = new Audio('./so/PairSound.mp3');
        sonido.play();
    } else {
        setTimeout(() => {
            girades[0].removeClass("carta-girada");
            girades[1].removeClass("carta-girada");
            girades = [];
        }, 800);
    }
}

function contarTemps(files, columnes, temps) {
    if (files === 2 && columnes === 2) {

        temps = 20;
        $("#temps").text(temps);

        let timer = setInterval(() => {
            temps--;
            $("#temps").text(temps);
        }, 1000);

    } else if (files === 4 && columnes === 4) {
        temps = 40;
        $("#temps").text(temps);

        let timer = setInterval(() => {
            temps--;
            $("#temps").text(temps);
        }, 1000);

    } else if (files === 6 && columnes === 6) {
        temps = 60;
        $("#temps").text(temps);

        let timer = setInterval(() => {
            temps--;
            $("#temps").text(temps);
        }, 1000);
    }
}


