package graphql

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/julienschmidt/httprouter"
)

type query struct {
	UserID string
}

func (q *query) Hello() string {
	return fmt.Sprintf("Hello, %s", q.UserID)
}

// Handle POST /graphql
func Handle(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	auth := r.Header.Get("Authorization")
	userID, err := authorize(auth)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	s := `
		type Query {
			hello: String!
		}
	`
	schema := graphql.MustParseSchema(s, &query{UserID: userID})
	(&relay.Handler{Schema: schema}).ServeHTTP(w, r)
}

func authorize(accessToken string) (string, error) {
	if len(accessToken) == 0 {
		return "", errors.New("The access token is invalid")
	}
	return "1234", nil
}
