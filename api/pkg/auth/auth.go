package auth

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type credential struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type token struct {
	AccessToken string `json:"accessToken"`
}

// Handle POST /login
func Handle(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var c credential
	err := json.NewDecoder(r.Body).Decode(&c)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	accessToken, err := authenticate(&c)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&token{AccessToken: accessToken})
}

func authenticate(c *credential) (string, error) {
	return "thesecrettoken", nil
}
