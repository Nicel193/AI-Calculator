function openAssistance() {
    var div = document.getElementById("keypad");
    var divA = document.getElementById("assistance");

    if (div.style.display === 'none') {
        div.style.display = 'block';
        divA.style.display = 'none';
    } else {
        div.style.display = 'none';
        divA.style.display = 'block';

        openAdvanced();
    }
}

function openAdvanced() {
    var div = document.getElementById("keypad");
    divAdvanced = document.getElementById("advanced");

    if (div.style.display === 'none') {
        divAdvanced.style.display = 'none';
        return;
    }

    if (divAdvanced.style.display === 'none') {
        divAdvanced.style.display = 'block';
    } else {
        divAdvanced.style.display = 'none';
    }
}