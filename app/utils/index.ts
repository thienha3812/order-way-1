


export const convertToVnd = (number) =>{ 
    return number.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
}
