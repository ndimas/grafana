package api

import (
	"github.com/ndimas/grafana/pkg/bus"
	"github.com/ndimas/grafana/pkg/middleware"
	"github.com/ndimas/grafana/pkg/services/search"
)

func Search(c *middleware.Context) {
	query := c.Query("query")
	tags := c.QueryStrings("tag")
	starred := c.Query("starred")
	limit := c.QueryInt("limit")

	if limit == 0 {
		limit = 1000
	}

	searchQuery := search.Query{
		Title:     query,
		Tags:      tags,
		UserId:    c.UserId,
		Limit:     limit,
		IsStarred: starred == "true",
		OrgId:     c.OrgId,
	}

	err := bus.Dispatch(&searchQuery)
	if err != nil {
		c.JsonApiErr(500, "Search failed", err)
		return
	}

	c.JSON(200, searchQuery.Result)
}
