

fetch('/product')
.then(r => {
    if(r.ok)
        return r.json();
    else
        alert('Ошибка загрузки данных');
})
.then(res => {
    if(!res)
        return;

    res.forEach(i => {
        let text = '';
        let div = document.createElement('div');
        div.className = 'product';
        div.dataset.id = i.id;
        text += 
`<div class="prod_name">${i.name}</div>
<div class="prod_count">${i.count}</div>
<div class="prod_cost">${i.cost}</div>
<div class="prod_edit"><input type="button" class="edit_button" value="Изменить" data-id="${i.id}" onclick="Edit(this)"></div>
<div class="prod_edit"><input type="checkbox" class="delete_checkbox" data-id="${i.id}"></div>`;
        div.innerHTML = text;
        document.querySelector('#product_list').append(div);
    });
});

fetch('/sum')
.then(r => r.text())
.then(res => document.querySelector('#div_sum').innerHTML = 'Итоговая сумма: ' + res);

document.querySelector('#add_button').addEventListener('click', () =>{
    document.querySelector('#pre_hider').style.display = '';
});

let hider = document.querySelector('#pre_hider');
hider.addEventListener('click', event =>{
    if(event.target == hider){
        hider.style.display = 'none';
        document.querySelector('#product_name_t').value = '';
        document.querySelector('#product_count_t').value = '1';
        document.querySelector('#product_cost_t').value = '50';
        document.querySelector('#add_button_form').value = 'Добавить';
        document.querySelector('#add_edit_form').dataset.id = '-1';
    }
});

document.querySelector('#delete_button').addEventListener('click', () =>{
    let chk = document.querySelectorAll('.delete_checkbox');
    let ind = [];
    chk.forEach(i => {
        if(i.checked)
            ind.push(i.dataset.id)
    });
    if(ind.length == 0){
        alert('Не выбран ни один товар');
        return;
    }
    let conf = ind.length == 1 ? 'Вы действительно желаете удалить выбранный товар?' :
        'Вы действительно желаете удалить выбранные товары?'
    if(!confirm(conf))
        return;
    fetch('/product', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(ind)
    })
    .then(r => {
        if(r.ok){
            chk.forEach(i => {
                if(i.checked)
                    document.querySelector('#product_list').removeChild(i.parentNode.parentNode);
            });
            fetch('/sum')
            .then(r => r.text())
            .then(res => document.querySelector('#div_sum').innerHTML = 'Итоговая сумма: ' + res);
        }
    });
});

document.querySelector('#add_button_form').addEventListener('click', () =>{
    if(isNaN(+document.querySelector('#product_cost_t').value)){
        alert('Цена должна быть числом');
        return;
    }

    fetch('/product', {
        method: (+document.querySelector('#add_edit_form').dataset.id == -1 ? 'PUT' : 'POST'),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            id: +document.querySelector('#add_edit_form').dataset.id,
            name: document.querySelector('#product_name_t').value,
            count: +document.querySelector('#product_count_t').value,
            cost: +document.querySelector('#product_cost_t').value
        })
    })
    .then(r => r.json()
        .then(res => {
            if(+document.querySelector('#add_edit_form').dataset.id == -1){
                let text = '';
                let div = document.createElement('div');
                div.className = 'product';
                div.dataset.id = res.id;
                text = 
`<div class="prod_name">${res.name}</div>
<div class="prod_count">${res.count}</div>
<div class="prod_cost">${res.cost}</div>
<div class="prod_edit"><input type="button" class="edit_button" value="Изменить" data-id="${res.id}" onclick="Edit(this)"></div>
<div class="prod_edit"><input type="checkbox" class="delete_checkbox" data-id="${res.id}"></div>`;
                div.innerHTML = text;
                document.querySelector('#product_list').append(div);
            }
            else{
                let elem = document.querySelectorAll('.product');
                let i = 0;
                for(; i < elem.length; i++)
                    if(+elem[i].dataset.id == +document.querySelector('#add_edit_form').dataset.id)
                        break;
                let t = elem[i].querySelectorAll('div');
                t[0].innerHTML = res.name;
                t[1].innerHTML = res.count;
                t[2].innerHTML = res.cost;
            }
            document.querySelector('#product_name_t').value = '';
            document.querySelector('#product_count_t').value = '1';
            document.querySelector('#product_cost_t').value = '50';
            document.querySelector('#add_button_form').value = 'Добавить';
            document.querySelector('#add_edit_form').dataset.id = '-1';
            fetch('/sum')
            .then(r => r.text())
            .then(res => document.querySelector('#div_sum').innerHTML = 'Итоговая сумма: ' + res);
        })
    );
});

document.querySelector('#clear_button_form').addEventListener('click', () =>{
    document.querySelector('#product_name_t').value = '';
    document.querySelector('#product_count_t').value = '1';
    document.querySelector('#product_cost_t').value = '50';
    document.querySelector('#add_button_form').value = 'Добавить';
    document.querySelector('#add_edit_form').dataset.id = '-1';
});

function Edit(e){
    document.querySelector('#add_edit_form').dataset.id = e.dataset.id;
    document.querySelector('#pre_hider').style.display = '';
    document.querySelector('#add_button_form').value = 'Применить';
    let divs = e.parentNode.parentNode.querySelectorAll('div');
    document.querySelector('#product_name_t').value = divs[0].innerHTML;
    document.querySelector('#product_count_t').value = divs[1].innerHTML;
    document.querySelector('#product_cost_t').value = divs[2].innerHTML;
}