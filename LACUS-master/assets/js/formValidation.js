userValidation = function(name,surname){
    var regex = /^[a-zA-Z ]{2,30}$/;
    if (regex.test(name) && regex.test(surname)) {
        return true;
    }
    else {
        return false;
    }
}
dateValidation = function(date){
    var dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    console.log(date)
    // Verifico che la data inserita sia di un formato valido
    if (date.match(dateFormat)) {
        var opera1 = date.split('/');
        var opera2 = date.split('-');
        lopera1 = opera1.length;
        lopera2 = opera2.length;
        // Recupero il giorno, il mese e l'anno
        if (lopera1 > 1) {
            var pdate = date.split('/');
        }
        else if (lopera2 > 1) {
            var pdate = date.split('-');
        }
        var dd = parseInt(pdate[2]);
        var mm = parseInt(pdate[1]);
        var yy = parseInt(pdate[0]);
        console.log(dd+mm+yy)
        // Creiamo la lista dei mesi dell'anno
        var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (mm == 1 || mm > 2) {
            if (dd > ListofDays[mm - 1]) {
                console.log("1")
                return false;
            }
        }
        if (mm == 2) {
            var lyear = false;
            if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                lyear = true;
            }
            if ((lyear == false) && (dd >= 29)) {
                console.log("2")
                return false;
            }
            if ((lyear == true) && (dd > 29)) {
                console.log("3")
                return false;
            }
            
        }
        console.log("4"+CompareDateWithToday(yy,mm,dd))
        return CompareDateWithToday(yy,mm,dd);
        
    }
    else {
        
        console.log("5")
        return false;
    }
}
function CompareDateWithToday(yy,mm,dd) {  
    var todayDate = new Date(); 
    var dateOne = new Date(yy, mm-1, dd);  
    
    if (todayDate > dateOne)  return false;
    else return true;  
     
 }

packDimValidation = function(height,width,depth){
    if(height== 0 || width == 0 || depth==0){
        return false;
    }
    return true;
}
placeValidation = function(place){
    const regex = /(Via|Viale|Piazza) ([A-Za-z']{1,20}[ ]{0,1}){1,3}, [0-9]{1,4}[A-Za-z]{0,1}, ([A-Z][a-z']{2,20}[ ]{0,1}){1,4}, [A-Z]{2}, Italia/;
    if(regex.test(place)){
        return true;
    }else{
        return false;
    }
}
