const testInput =
    '| № |           Название         | Цена(руб)(-) | Вес(кг)(+) | Время отклика(мс)(-) | Количество клавиш(+) |\n' +
    '|:-:|----------------------------|:------------:|:----------:|:--------------------:|:--------------------:|\n' +
    '| 1 | Razer Huntsman V2 TKL      |     12760    |   0.748    | 0.125                | 87                   |\n' +
    '| 2 | A4TECH Bloody B140N        |     1940     |   0.870    | 1                    | 104                  |\n' +
    '| 3 | Oklick 920G IRON EDGE      |     3999     |   1.400    | 1                    | 104                  |\n' +
    '| 4 | A4TECH Bloody B820R        |     4620     |   0.825    | 0.2                  | 104                  |\n' +
    '| 5 | A4TECH Bloody B314         |     2399     |   1.020    | 0.2                  | 113                  |\n' +
    '| 6 | A4TECH Bloody B500N        |     2499     |   0.800    | 1                    | 104                  |\n' +
    '| 7 | Red Square Keyrox TKL g3ms |     5499     |   0.880    | 1                    | 87                   |\n' +
    '| 8 | HIPER MK-1 SPIKE           |     3999     |   0.950    | 1                    | 61                   |';

//  Всегда первые два столбца это нумерация и название!

const resolved = tableResolver(testInput);

console.table(resolved);

//Второй аргумент - столбец, по которому срезаем, начиная с нуля, при этом нельзя использовать значение меньше 2, так так это название и номер
//Третий - значение, по которому ведётся срез
var cutted = resolved;
cutted = borderCut(cutted, 2, 4000);
cutted = borderCut(cutted, 5, 100);
cutted = borderCut(cutted, 3, 0.800);

console.table(cutted);

const parettoOptimized = paretto(cutted);

console.table(parettoOptimized);
console.log(extractNums(parettoOptimized));




function paretto(resolved) {
    const out = [];
    for(let i1 = 0; i1 < resolved.length-1; i1++) {
        let temp = [];
        for(let i2 = 0; i2 < resolved.length-1; i2++) {
            if(i2 >= i1) temp.push('x');
            else temp.push(compare(i1, i2));
        }
        out.push(temp);
    }
    return out;
}

function compare(i1, i2) {
    let c1 = resolved[i1+1];
    let c2 = resolved[i2+1];
    let p = 0;  // Положительно - в сторону первого сравниваемого
    let eq = 0;
    for(let i = 2; i < resolved[0].length; i++) {
        c1[i] = parseFloat(c1[i]);
        c2[i] = parseFloat(c2[i]);
        if(c1[i] == c2[i]) eq++;
        else {
            if(resolved[0][i].charAt(resolved[0][i].length-2) == '+') {
                if(c1[i] > c2[i]) p++;
                else p--;
            }
            else {
                if(c1[i] < c2[i]) p++;
                else p--;
            }
        }
    }
    if((p + eq) == resolved[0].length-2) return 'А'+(i1+1);
    if((p - eq) == -(resolved[0].length-2)) return 'А'+(i2+1);
    return 'н';
}

function borderCut(table, parametr, value) {
    const out = [];
    out.push(table[0]);
    if(parametr < 2) { console.error('Не может быть параметр 1 или 0!'); return null; }
    const ch = table[0][parametr].charAt(table[0][parametr].length-2);
    for(let i = 1; i < table.length; i++) {
        if(ch == "+") {
            if(table[i][parametr] >= value) out.push(table[i]);
        } else {
            if(table[i][parametr] <= value) out.push(table[i]);
        }
    }
    return out;
}

function tableResolver(t) {
    t = t.replace(/ /g,'');
    const awns = [];
    t.split('\n').forEach((v, i) => {
        let tempArr = [];
        if(i!=1) {
            v.split('|').forEach((val, i2) => {
                if (val) {
                    tempArr.push(val);
                }
            })
            awns.push(tempArr)
        }
    })
    return awns;
}

function extractNums(table) {
    var out = [];
    for(let i1 = 0; i1 < table.length; i1++) for(let i2 = 0; i2 < table[0].length; i2++) {
        let a = table[i1][i2];
        if(a != 'н' && a != 'x' && out.indexOf(a) === -1) out.push(a)
    }
    return out.sort();
}
