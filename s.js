var express = require('express');
var path = require('path');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/',express.static(path.join(__dirname, 'src')));

let products=[];
app.get('/product',(req,res)=>
{
    res.json(products);
})
app.put('/product',(req,res)=>
{
    let p=req.body;
    if(p.name&&+p.count&&+p.cost)
    {
        products.push({name:p.name,count:p.count,cost:p.cost,id:(products.length>0?products[products.length-1].id+1:0)});
        res.json(products[products.length-1]);
        return;
    } 
    res.status(400);   
})
app.post('/product',(req,res)=>
{
    let p=req.body;
    if(p.name&&+p.count&&+p.cost&&+p.id)
    {
        let t = products.find(i=>i.id==p.id);
        if(!t)
        {
            res.status(400);
            return;
        }
        t.name=p.name;
        t.count=p.count;
        t.cost=p.cost;
        res.json(t);
        res.send(200);
        return;
    }
    res.status(400);
})
app.delete('/product',(req,res)=>
{
    let p=req.body;
    p.forEach(element => {
        products.splice(products.findIndex(t=>t.id==element),1);
        
    });
    res.send(200);
})
app.get('/sum',(req,res)=>
{
    let sum=0;
    products.forEach(e=>sum+=e.count*e.cost);
    res.send(sum.toString());
})
app.listen(3000);