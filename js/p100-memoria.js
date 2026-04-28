var nFiles, nColumnes; // Variables per numero de files i columnes
var ampladaCarta, alcadaCarta; //Variables per la mida de les cartes
var separacio = 10;

var cartes = [];
var girades = [];
var clics = 0;
var parellesContador = 0;
var maxClics;
var temps = 0;
var timer = null;
var incrementTemps = 20;
var ultimaCarta = null;

const DECK = 1;
const POKEM = 2;
const POKER = 3;

var tipoCarta;
var separacioH = 20, separacioV = 20;
var deckWidth = 80, deckHeight = 120;
var pokeWidth = 111, pokeHeight = 111;
var pokerWidth = 79, pokerHeight = 124;

$(function () {

    iniciarJoc(2, 2,POKEM);

});

function iniciarJoc(files, columnes, type) {

    cerrarMenu(); 

    nFiles = files;
    nColumnes = columnes;

    if (type == DECK) {
        ampladaCarta = deckWidth;
        alcadaCarta = deckHeight;
        tipoCarta = "deck";

    } else if (type == POKEM) {
        ampladaCarta = pokeWidth;
        alcadaCarta = pokeHeight;
        tipoCarta = "pokem";
    }else if (type == POKER) {
        ampladaCarta = pokerWidth;
        alcadaCarta = pokerHeight;
        tipoCarta = "poker";
    }

    clics = 0;
    $("#contador").text(clics);
    parellesContador = 0;
    $("#contadorParelles").text(parellesContador);
    generarTauler();
    generarCartes();
    posicionarCartes(type);

    contarTemps(files, columnes, temps);

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

    let ample = nColumnes * (ampladaCarta + separacio);
    let alt = nFiles * (alcadaCarta + separacio);

    $("#tauler").css({
        width: ample,
        height: alt
    });

    $(".carta").on("click", girarCarta);

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

function posicionarCartes(type) {

    let index = 0;
    $(".carta").each(function () {
        let f = Math.floor(index / nColumnes) + 1;
        let c = (index % nColumnes) + 1;

        $(this).css({
            "width": ampladaCarta + "px",
            "height": alcadaCarta + "px",
            "left": ((c - 1) * (ampladaCarta + separacio) + separacio) + "px",
            "top": ((f - 1) * (alcadaCarta + separacio) + separacio) + "px"
        });

        $(this).find(".davant").addClass(tipoCarta+cartes[index]);
        if (type == DECK) {
            $(this).find(".davant").removeClass("deck pokemon poker").addClass("deck");
            $(this).find(".darrera").removeClass("deck pokemon poker").addClass("deck");
        }
        else if (type == POKEM) {
            $(this).find(".davant").removeClass("deck pokemon poker").addClass("pokemon");
            $(this).find(".darrera").removeClass("deck pokemon poker").addClass("pokemon");
        }
        else if (type == POKER) {
            $(this).find(".davant").removeClass("deck pokemon poker").addClass("poker");
            $(this).find(".darrera").removeClass("deck pokemon poker").addClass("poker");
        }
        index++;
    });
}

function girarCarta(ultimaCarta) {

    if ($(this).hasClass("carta-girada")) return;

    if (girades.length === 2) return;

    $(this).addClass("carta-girada");
    girades.push($(this));

    clics++;
    $("#contador").text(clics);

    let sonido = new Audio('./so/ClickSound.mp3');
    sonido.play();

    if (girades.length === 2) {
        comprobarPareja();
    }

}

function comprobarPareja() {

    let c1 = girades[0].find(".davant").attr("class");
    let c2 = girades[1].find(".davant").attr("class");

    if (c1 === c2) {
        setTimeout(() => {
            girades[0].fadeOut();
            girades[1].fadeOut();
            girades = [];
            hasguanyat();
        }, 500);
        // Reproducir un sonido cuando las Cartas se giran
        let sonido = new Audio('./so/PairSound.mp3');
        sonido.play();
        // Incrementar el contador de parejas
        parellesContador++;
        $("#contadorParelles").text(parellesContador);
    } else {
        setTimeout(() => {
            girades[0].removeClass("carta-girada");
            girades[1].removeClass("carta-girada");
            girades = [];
        }, 800);
    }
}

function contarTemps(files, columnes, temps) {

    if ($(".carta").on("click")) {
        if (timer !== null) {
            clearInterval(timer);
        }

        if (files === 2 && columnes === 2) {
            temps = incrementTemps * columnes;
        } else if (files === 4 && columnes === 4) {
            temps = incrementTemps * columnes;
        } else if (files === 3 && columnes === 4) {
            temps = incrementTemps * columnes;
        } else if (files === 6 && columnes === 6) {
            temps = incrementTemps * columnes;
        }else{
            temps = incrementTemps* columnes;
        }

        $("#temps").text(temps);

        timer = setInterval(() => {
            temps--;
            $("#temps").text(temps);

            if (temps <= 0) {
                clearInterval(timer);
                alert("Temps acabat!");
            }

        }, 1000);

    }
}

function hasguanyat() {
    let totalParelles = (nFiles * nColumnes) / 2;

    if (parellesContador === totalParelles) {
        clearInterval(timer);
        
        let tempsFinal = parseInt($("#temps").text());
        alert("HAS GUANYAT EN " + clics + " clics.");
       
    
    verificarRecord(tempsFinal);
    }
}
function verificarRecord(tempsRestant) {
   
    let clauRecord = "millorrecord" + nFiles + "x" + nColumnes;
    
    let recordAnterior = localStorage.getItem(clauRecord);

   
    if (recordAnterior === null || tempsRestant > Number(recordAnterior)) {
        
        localStorage.setItem(clauRecord, tempsRestant);
       
        $("#millorrecord" + nFiles + "x" + nColumnes).text(tempsRestant);
        
        alert("Nou rècord personal per a " + nFiles + "x" + nColumnes + "!");
    }
}


