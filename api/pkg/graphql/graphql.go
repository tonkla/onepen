package graphql

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type query struct{}

func (q *query) Hello() string { return "Hello, world!" }

// Handle POST /graphql
func Handle(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	// auth := r.Header.Get("Authorization")

	// s := `
	// 	type Query {
	// 		hello: String!
	// 	}
	// `
	// schema := graphql.MustParseSchema(s, &query{})
	// &relay.Handler{Schema: schema}
}
