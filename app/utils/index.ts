


export const convertToVnd = (number) =>{ 
    return Number(number).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
}
