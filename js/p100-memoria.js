//Variables
var nFiles, nColumnes; // Variables per numero de files i columnes
var ampladaCarta, alcadaCarta; //Variables per la mida de les cartes
var separacio = 10; //Separació entre cartes

var cartes = []; //Array per les cartes
var girades = []; //Array per les cartes que s'han girat en el moment
var clics = 0; //Contador de clics
var parellesContador = 0; //Contador de parelles trobades
var maxClics = 0; //Màxim de clics per aquesta mida
var temps = 0; //Variable per el temps restant
var timer = null; //Variable per el temporitzador
var incrementTemps = 20;
var ultimaCarta = null;
var juegoIniciado = false;

const DECK = 1;
const POKEM = 2;
const POKER = 3;

var tipoCarta;
var separacioH = 20, separacioV = 20;
var deckWidth = 80, deckHeight = 120;
var pokeWidth = 111, pokeHeight = 111;
var pokerWidth = 79, pokerHeight = 124;

$(function () {

    let mides = ["2x2", "3x4", "4x4", "6x6"];

    mides.forEach(mida => {
        let rec = localStorage.getItem("millorrecord" + mida);
        if (rec !== null) {

            $("#millorrecord" + mida).text(rec);
        }
    });


    iniciarJoc(2, 2, getTipoCarta());


});

function mostrarMenu() {
    document.getElementById("menu").style.display = "block";
}

function cerrarMenu() {
    document.getElementById("menu").style.display = "none";
}

function personalitzat() {
    let files = parseInt(prompt("Introdueix el nombre de files (2, 3, 4 o 6):"));
    let columnes = parseInt(prompt("Introdueix el nombre de columnes (2, 4 o 6):"));

    if (files >= 2 && files <= 6 && columnes >= 2 && columnes <= 6) {
        if ((files * columnes) % 2 !== 0) {
            alert("El nombre total de cartes ha de ser parell. Si us plau, introdueix valors vàlids.");
            return;
        }
        iniciarJoc(files, columnes, getTipoCarta());
    } else {
        alert("Entrades no vàlides. Si us plau, introdueix valors entre 2 i 6.");
    }
}
function iniciarJoc(files, columnes, type) {

    cerrarMenu();

    juegoIniciado = false;
    nFiles = files;
    nColumnes = columnes;
    switch (type) {
        case DECK:
            ampladaCarta = deckWidth;
            alcadaCarta = deckHeight;
            tipoCarta = "deck";
            break;
        case POKEM:
            ampladaCarta = pokeWidth;
            alcadaCarta = pokeHeight;
            tipoCarta = "pokem";
            break;
        case POKER:
            ampladaCarta = pokerWidth;
            alcadaCarta = pokerHeight;
            tipoCarta = "poker";
            break;
    }
    clics = 0;
    $("#contador").text(clics);
    parellesContador = 0;
    $("#contadorParelles").text(parellesContador);

    if (timer !== null) {
        clearInterval(timer);
    }

    temps = incrementTemps * (nFiles * nColumnes) / 2;
    $("#temps").text(temps);
    timer = null;

    generarTauler();
    generarCartes();
    posicionarCartes(type);


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

        $(this).find(".davant").addClass(tipoCarta + cartes[index]);


        switch (type) {
            case DECK:
                $(this).find(".davant").removeClass("deck pokemon poker").addClass("deck");
                $(this).find(".darrera").removeClass("deck pokemon poker").addClass("deck");
                break
            case POKEM:
                $(this).find(".davant").removeClass("deck pokemon poker").addClass("pokemon");
                $(this).find(".darrera").removeClass("deck pokemon poker").addClass("pokemon");
                break;
            case POKER:
                $(this).find(".davant").removeClass("deck pokemon poker").addClass("poker");
                $(this).find(".darrera").removeClass("deck pokemon poker").addClass("poker");
                break;
        }
        index++;
    });
}

function reproduirSo(path) {
    if ($("#soToggle").is(":checked")) {
        let audio = new Audio(path);
        audio.play();
    }
}

function girarCarta(ultimaCarta) {

    if ($(this).hasClass("carta-girada")) return;

    if (girades.length === 2) return;

    if (!juegoIniciado) {
        juegoIniciado = true;
        contarTemps(nFiles, nColumnes, temps);
    }

    $(this).addClass("carta-girada");
    girades.push($(this));

    clics++;
    $("#contador").text(clics);
    reproduirSo('./so/ClickSound.mp3');

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
        reproduirSo('./so/PairSound.mp3');
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


    if (timer !== null) return; // evita múltiples timers

    temps = incrementTemps * columnes;

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

function hasguanyat() {
    let totalParelles = (nFiles * nColumnes) / 2;

    if (parellesContador === totalParelles) {

        clearInterval(timer);
        lanzarConfeti();

        let tempsFinal = parseInt($("#temps").text());

        setTimeout(() => {

            let mensaje = "Has guanyat en " + clics + " clics i " + tempsFinal + " segons.";

            verificarRecord(tempsFinal);

            let respuesta = confirm(mensaje + "\n\nVols jugar una altra partida?");

            if (respuesta) {
                iniciarJoc(nFiles, nColumnes, getTipoCarta());
            } else {
                alert("Partida finalitzada.");
                iniciarJoc(2, 2, getTipoCarta());
            }

        }, 1000);
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

function getTipoCarta() {
    let valor = $("input[name='type']:checked").val();
    switch (valor) {
        case "1":
            return POKEM;
        case "2":
            return DECK;
        default:
            return POKER;
    }

}


function lanzarConfeti() {

    let duration = 3000;
    let end = Date.now() + duration;

    let interval = setInterval(function () {

        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }

        confetti({
            particleCount: 100,
            angle: 60,
            spread: 90,
            origin: { x: 0, y: 1 }
        });

        confetti({
            particleCount: 100,
            angle: 120,
            spread: 90,
            origin: { x: 1, y: 1 }
        });

    }, 250);
}