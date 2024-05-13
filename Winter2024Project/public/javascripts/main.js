

document.addEventListener("DOMContentLoaded", function (event) {

this.getElementById("buttonAdd").addEventListener("click", function() {

    let x = parseFloat(document.getElementById("firstNumber").value)
    let y = parseFloat(document.getElementById("secondNumber").value)

    document.getElementById("answer").value = x + y;
})

this.getElementById("buttonSubtract").addEventListener("click", function() {

    let x = parseFloat(document.getElementById("firstNumberS").value)
    let y = parseFloat(document.getElementById("secondNumberS").value)

    document.getElementById("answerS").value = x - y;
})

});