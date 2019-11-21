package auth

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type credential struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Handle POST /login
func Handle(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var c credential
	err := json.NewDecoder(r.Body).Decode(&c)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	fmt.Println(c.Username, c.Password)
}
