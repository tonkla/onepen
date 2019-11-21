package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"

	"onepen/api/pkg/auth"
	"onepen/api/pkg/graphql"
)

func main() {
	router := httprouter.New()
	router.POST("/login", auth.Handle)
	router.POST("/graphql", graphql.Handle)
	router.GET("/ping", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		fmt.Fprintln(w, "pong")
	})
	log.Fatal(http.ListenAndServe(":8080", router))
}
