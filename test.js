let obj = {"sjdfhdfsjkhdsfh": {
    "name": "misho",
    "value": "toni",
}}

function getNameOfJob(name, val) {
    function getKeyByValue(value) {
        for (const [key, value] of Object.entries(obj))
        {
            if(value.name == name && value.value == val){
                return key
            }
        }
    }

    console.log(Object.entries(obj))
    return getKeyByValue()
}

console.log(getNameOfJob("misho", "toni"))