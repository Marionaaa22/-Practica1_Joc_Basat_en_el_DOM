var nFiles, nColumnes;
var ampladaCarta, alcadaCarta;
var separacio = 10;

var cartes = [];
var girades = [];
var clics = 0;
var parellesContador = 0;
var maxClics;

$(function () {

    iniciarJoc(2,2);
});

function iniciarJoc(files, columnes) {

    nFiles = files;
    nColumnes = columnes;

    clics = 0;
    $("#contador").text(clics);
    parellesContador = 0;
    $("#contadorParelles").text(parellesContador);
    generarTauler();
    generarCartes();
    posicionarCartes();
}

function generarTauler() {
    $("#tauler").empty();

    for (let f = 0; f < nFiles; f++) {
        for (let c = 0; c < nColumnes; c++) {

            let carta = $(`
                <div class="carta" id = "f1c1">
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
    $(".carta").each(function() {
        let f = Math.floor(index / nColumnes) + 1;
        let c = (index % nColumnes) + 1;
        
        $(this).css({
            "left" :  ((c-1)*(ampladaCarta+separacio)+separacio)+"px",
            "top"  :  ((f-1)*(alcadaCarta+separacio)+separacio)+"px"
        });

        $(this).find(".davant").addClass(cartes[index]);
        index++;
    });
}

function girarCarta() {

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



