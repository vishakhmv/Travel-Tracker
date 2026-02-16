import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
let result=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client({
  user:"postgres",
  password:"87654321",
  host:"localhost",
  port:5432,
  database:'world'
});

db.connect();

async function checkCountries(){
  let res= await db.query("select country_code from visited_countries");
  let countries=[];
  res.rows.forEach(element => {
    countries.push(element.country_code);
  });
  return countries;
}


app.get("/", async (req, res) => {
  //Write your code here.
  let result=await db.query("select * from visited_countries");
  return res.render("index.ejs",{countries:result.rows.map(row=>row.country_code).join(","),total:result.rows.length});
});

app.post("/add",async(req,res)=>{
  let new_country=req.body.country;
  let country_code;
  try{
  let new_country_code=await db.query("SELECT country_code from countries where LOWER(country_name) LIKE '%' || $1 || '%';",[new_country.toLowerCase()]);
  country_code=new_country_code.rows[0].country_code;
  }
  catch{
    let countries=await checkCountries();
    return res.render("index.ejs",{countries:countries.join(","),total:countries.length,error:"Country not exist. Try again"});
  }
  try{
  await db.query("insert into visited_countries (country_code) values($1)",[country_code]);
  }
  catch{
    let countries=await checkCountries();
    return res.render("index.ejs",{countries:countries.join(","),total:countries.length,error:"Country already added before"});
  }
  return res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
