
import express from "express";
import cors from "cors";

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());


//Routes

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/ai/:tools", (req, res) => {
  res.send(`You requested AI tool: ${req.params.tools}`);
});


//jokes route

app.get("/jokes", (req, res) =>{

  const jokes = [
    {
      id: 1,
      title: "Why did the scarecrow win an award?",
      joke: "Because he was outstanding in his field!"
    }, 
    {
      id: 2,
      title: "Why don't scientists trust atoms?",
      joke: "Because they make up everything!"
    } ,
    {
      id: 3,
      title: "Why did the bicycle fall over?",
      joke: "Because it was two-tired!"
    },
    {
      id: 4,
      title: "What do you call fake spaghetti?",
      joke: "An impasta!"
    },
    {
      id: 5,
      title: "Why did the math book look sad?",
      joke: "Because it had too many problems."
    }

  
    
]
return res.json(jokes);
}
  );
    

app.listen(5000, () => console.log("Server running on port 5000"));
