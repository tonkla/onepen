package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"

	"onepen/api/pkg/graphql"
)

func init() {
	var err error
	if env := os.Getenv("ENV"); env != "" {
		err = godotenv.Load(fmt.Sprintf(".env.%s", env))
	} else {
		err = godotenv.Load()
	}
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	router := httprouter.New()
	router.POST("/graphql", graphql.Handler)
	router.GET("/ping", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		fmt.Fprintln(w, "pong")
	})
	log.Fatal(http.ListenAndServe(":8080", router))
}
