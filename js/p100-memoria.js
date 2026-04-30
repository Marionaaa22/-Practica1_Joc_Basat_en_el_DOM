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

$(function () {

    let mides = ["2x2", "3x4", "4x4", "6x6"];
    
    mides.forEach(mida => {
        let rec = localStorage.getItem("millorrecord" + mida);
        if (rec !== null) {
            
            $("#millorrecord" + mida).text(rec);
        }
    });


    iniciarJoc(2, 2);

});

function mostrarMenu() {
    document.getElementById("menu").style.display = "block";
}

function cerrarMenu() {
    document.getElementById("menu").style.display = "none";
}

function iniciarJoc(files, columnes) {

    cerrarMenu(); 

    nFiles = files;
    nColumnes = columnes;

    clics = 0;
    $("#contador").text(clics);
    parellesContador = 0;
    $("#contadorParelles").text(parellesContador);

    if (timer !== null) {
       clearInterval(timer);
    }
    
    timer = null;
    $("#temps").text(0);
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
  
    if (timer === null) {
        contarTemps(nFiles, nColumnes);
    }

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

   

let seccio = files + "x" + columnes;
switch (seccio) {


case "2x2": 
temps = incrementTemps * columnes; break;
case "4x4":
temps = incrementTemps * columnes; break;
case "3x4":
temps = incrementTemps * columnes; break;
case "6x6": 
temps = incrementTemps * columnes; break;
case files+"x"+columens:
temps = incrementTemps * columnes; break;
       
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


function hasguanyat() {
    let totalParelles = (nFiles * nColumnes) / 2;

    if (parellesContador === totalParelles) {
        clearInterval(timer);
        
        let tempsFinal = parseInt($("#temps").text());

      
        let respuesta = confirm("Has guanyat en  " + clics + " clics. ¿Vols resetear la partida?");

       
        verificarRecord(tempsFinal);

      
        if (respuesta) {
       
            iniciarJoc(nFiles, nColumnes);
            
        } else {
            
            alert("Partida finalitzada.");
        }
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


