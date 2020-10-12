//Funzione che determina se una data sia valida o meno
exports.validatedate = function (inputText) {
    var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    // Verifico che la data inserita sia di un formato valido
    if (inputText.match(dateformat)) {
        
        var opera1 = inputText.split('/');
        var opera2 = inputText.split('-');
        lopera1 = opera1.length;
        lopera2 = opera2.length;
        // Recupero il giorno, il mese e l'anno
        if (lopera1 > 1) {
            var pdate = inputText.split('/');
        }
        else if (lopera2 > 1) {
            var pdate = inputText.split('-');
        }
        var dd = parseInt(pdate[0]);
        var mm = parseInt(pdate[1]);
        var yy = parseInt(pdate[2]);
        // Creiamo la lista dei mesi dell'anno
        var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (mm == 1 || mm > 2) {
            if (dd > ListofDays[mm - 1]) {
                
                return false;
            }
        }
        if (mm == 2) {
            var lyear = false;
            if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                lyear = true;
            }
            if ((lyear == false) && (dd >= 29)) {
                
                return false;
            }
            if ((lyear == true) && (dd > 29)) {
                
                return false;
            }
            
        }
        return CompareDateWithToday(yy,mm,dd);
        
    }
    else {
        

        return false;
    }
}

function CompareDateWithToday(yy,mm,dd) {  
    var todayDate = new Date(); 
    var dateOne = new Date(yy, mm-1, dd);  
    if (todayDate > dateOne)  return false; 
    else return true;  
     
 }
 
 //Funzione che per determinare se la data passata è quella odierna
 exports.checkIfIsToday = function (date){
    var opera1 = date.split('/');
    var opera2 = date.split('-');
    lopera1 = opera1.length;
    lopera2 = opera2.length;
    // Extract the string into month, date and year
    if (lopera1 > 1) {
        var pdate = date.split('/');
    }
    else if (lopera2 > 1) {
        var pdate = date.split('-');
    }
    console.log(pdate)
    var dd = parseInt(pdate[2]);
    var mm = parseInt(pdate[1]);
    var yy = parseInt(pdate[0]);
    var todayDate = new Date();
    var dateOne = new Date(yy,mm-1,dd);
    console.log(dateOne.getDate() == todayDate.getDate() &&
    dateOne.getMonth() == todayDate.getMonth() &&
    dateOne.getFullYear() == todayDate.getFullYear())
    return dateOne.getDate() == todayDate.getDate() &&
    dateOne.getMonth() == todayDate.getMonth() &&
    dateOne.getFullYear() == todayDate.getFullYear()
}
//Funzione che ritorna il giorno attuale
exports.getToday = function(){
    var todayDate = new Date();
    var dd = String(todayDate.getDate()).padStart(2, '0');
    var mm = String(todayDate.getMonth() + 1).padStart(2, '0');
    var yyyy = todayDate.getFullYear();

    return todayDate = mm + '/' + dd + '/' + yyyy;
}
exports.prova = function(){
    console.log("Prova");
}