function displayResult(pin) {
    var container = document.createElement("p");
    var headerTexts = ["Property id:"+pin+"\n"];
    var header = document.createElement("h3");
    header.appendChild(document.createTextNode(headerTexts));
    container.appendChild(header);
    // COOK COUNTY
    var ccrdImg = document.createElement("img");
    ccrdImg.setAttribute("src", "/Images/CookCounty/" +pin+ ".png");
    container.appendChild(ccrdImg);
    // CCRD
    // var dTaxImg = document.createElement("img");
    // dTaxImg.setAttribute("src", "/Images/RecorderOfDeeds/" +pin+ ".png");
    // container.appendChild(dTaxImg);
    //Delinquent Tax Search
    var cccImg = document.createElement("img");
    cccImg.setAttribute("src", "/Images/TaxDelinquent/" +pin+ ".png");
    container.appendChild(cccImg);
    // Clerk OF COURT
    container.appendChild(document.createElement("br"));
    var taxPortalImg = document.createElement("img");
    taxPortalImg.setAttribute("src", "/Images/ClerkOfCourt/" +pin+ ".png");
    container.appendChild(taxPortalImg);
    container.appendChild(document.createElement("br"));
    document.getElementById("content").appendChild(container);
}
function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}
async function checkIfImageisReady(pin,status) {
    if (imageExists("/Images/ClerkOfCourt/" + pin + ".png")) {
        displayResult(pin);
        console.log("displaying results of" + pin);
        console.log(status);
        if(status == 1){
            document.getElementById("loading").setAttribute("style", "display: none;");
            document.getElementById("printButton").disabled = false;
            console.log("Finished Requests");
        }
    } else {
        await new Promise(resolve => setTimeout(resolve, 10000));
        checkIfImageisReady(pin,status);
    }

}
function f(){

        var file = document.getElementById("fileInput").files[0];
        var reader = new FileReader();
        console.log("calling f:");
        reader.onload = async function (e) {
            var raw = reader.result;
            var matchStrings = raw.match(/\d{2}[ -]\d{2}[ -]\d{3}[ -]\d{3}[ -]\d{4}/g);
            var pins = [];
            for (var i = 0; i < matchStrings.length; i++) {
                pins.push(matchStrings[i]);
            }
            console.log("Total Pin Number:" + pins.length);
            if (pins.length > 1000) {
                alert("Error: too many pins. Ensure that the file contains 1000 or fewer pins.");
            } else {
                document.getElementById("resultField").setAttribute("style", "");
                $.ajax({
                    type: "POST",
                    url: "/csvupload/search",
                    data: JSON.stringify(pins)
                });
                console.log("Request send");
                for (var i = 0; i < pins.length; i++) {
                    if(i == pins.length - 1)
                        checkIfImageisReady(pins[i],1);
                    else
                        checkIfImageisReady(pins[i],0);

                }

            }
        };
        reader.readAsText(file);

}

function toPrintPage() {
    var prtContent = document.getElementById("resultField");
    var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write(prtContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
}
