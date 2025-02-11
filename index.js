const { initializeDatabase } = require("./db/db.connect")
const express = require("express")
const mongoose = require("mongoose")
// const fs = require("fs")
require("dotenv").config()
const Recipe = require("./models/recipe.models")

initializeDatabase()

const app = express()
app.use(express.json())

async function addRecipie(newRecipe){
    try{
        const addedRecipie = new Recipe(newRecipe)
        const savedRecipe = await addedRecipie.save()
        return savedRecipe
    }catch(error){
        console.log(error)
    }
}

app.post("/recipe", async (req, res) => {
    try{
        const createdRecipie = await addRecipie(req.body)
        if(createdRecipie){
            res.status(200).json({message: "Recipie added Successfully", recipe: createdRecipie})
        } else {
            res.status(404).json({error: "Recipe created not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to add recipie"})
    }
})

async function getRecipie(){
    try{
        const recipie = await Recipe.find()
        return recipie
    }catch(error){
        console.log(error)
    }
}

app.get("/recipe", async (req, res) => {
    try{
        const fetchedRecipe = await getRecipie()
        if(fetchedRecipe.length !=0){
            res.status(200).json({message: "Recipe Fetched successfully.", recipe: fetchedRecipe})
        }else{
            res.status(404).json({error: "Recipe not found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to get Recipe"})
    }
})

async function getRecipieByTitle(recipeTitle) {
    try{
        const recipe = await Recipe.findOne({title: recipeTitle})
        return recipe
    }catch(error){
        console.log(error)
    }
}

app.get("/recipe/:recipeTitle", async (req, res) => {
    try{
        const recipeByTitle = await getRecipieByTitle(req.params.recipeTitle)
        if(recipeByTitle !=0){
            res.status(200).json({message: "Recipe fetched successfully.", recipe: recipeByTitle})
        }else{
            res.status(404).json({error: "Recipe not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to get recipe"})
    }
})

async function getRecipieByAuthor(recipeAuthor) {
    try{
        const recipe = await Recipe.find({author: recipeAuthor})
        return recipe
    }catch(error){
        console.log(error)
    }
}

app.get("/recipe/author/:recipeAuthor", async (req, res) => {
    try{
        const recipeByAuthor = await getRecipieByAuthor(req.params.recipeAuthor)
        if(recipeByAuthor !=0){
            res.status(200).json({message: "Recipe fetched successfully.", recipe: recipeByAuthor})
        }else{
            res.status(404).json({error: "Recipe not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to get recipe"})
    }
})

async function getRecipeByDifficultyLevel(difficultyLevel) {
    try{
        const recipe = await Recipe.find({difficulty: difficultyLevel})
        return recipe
    } catch(error){
        console.log(error)
    }
}

app.get("/recipe/difficulty/:difficultyLevel", async (req, res) => {
    try{
        const recipeByDifficultyLevel = await getRecipeByDifficultyLevel(req.params.difficultyLevel)
        if(recipeByDifficultyLevel !=0){
            res.status(200).json({message: "Recipe fetched successfully", recipe: recipeByDifficultyLevel})
        }else{
            res.status(404).json({error: "recipe not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to get Recipe by difficulty level"})
    }
})

async function updateDifficultyLevel(recipeId, updateData){
    try{
        const updateRecipeDifficultyLevel = await Recipe.findByIdAndUpdate(recipeId, updateData, {new: true})
        return updateRecipeDifficultyLevel
    }catch(error){
        console.log(error.message)
    }
}

app.post("/recipe/updateLevel/:recipeId", async (req, res) => {
    try{
        const updatedDifficultyLevel = await updateDifficultyLevel(req.params.recipeId, req.body)
        if(updatedDifficultyLevel !=0){
            res.status(200).json({message: "Difficulty level updated.", recipe: updatedDifficultyLevel})
        }
    }catch(error){
        res.status(500).json({error: "Failed to update recipe difficulty level."})
    }
})

async function updaterecipeByTitle(recipeTitle, updatePrepTime, updateCookTime){
    try{
        const recipe = await Recipe.findOneAndUpdate({title: recipeTitle}, updatePrepTime, updateCookTime, {new: true})
        return recipe
      
    }catch(error){
        console.log(error)
    }
}

app.post("/recipe/updateRecipeTime/:recipeTitle", async (req, res) => {
    try{
        const updatedTime = await updaterecipeByTitle(req.params.recipeTitle, req.body)
        if(updatedTime !=0){
            res.status(200).json({message: "Recipe updated successfuly", recipe: updatedTime})
          } else{
            res.status(404).json("Error in few minutes")
          }
    }catch(error){
        res.status(500).json({error: "Failed to update recipe."})
    }
})

async function deleteRecipeById(recipeId){
    try{
        const recipe = await Recipe.findByIdAndDelete(recipeId)
        return recipe
    }catch(error){
        console.log(error)
    }
}

app.delete("/recipe/:recipeId", async (req, res) => {
    try{
        const deletedRecipe = await deleteRecipeById(req.params.recipeId)
        if(deletedRecipe){
            res.status(200).json({message: "Recipe deleted Successfully."})
        }else{
            res.status(404).json({error: "Recipe not found."})
        }
    }catch(error){
        rrs.status(500).json({error: "Failed to delete recipe by its Id."})
    }
})


const PORT = 3000
app.listen(PORT, (req, res) => {
    console.log("Server is running on", PORT)
})