from fastapi import APIRouter, Query, HTTPException, Depends, Request
from typing import List, Dict, Any, Optional
from app.db.mongodb import MongoDB
from bson import ObjectId
from app.utils.auth_middleware import rate_limit_middleware
import json

router = APIRouter()
db = MongoDB()

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

@router.get("/news", dependencies=[Depends(rate_limit_middleware)])
async def get_news(
    request: Request,
    limit: int = Query(20, ge=1),
    skip: int = Query(0, ge=0),
    sort_by: str = Query("timestamp_iso"),
    sort_order: int = Query(-1)  # -1 for descending, 1 for ascending
):
    """
    Get all news with pagination
    """
    # Apply tier-based limits
    max_results = request.state.max_results
    if limit > max_results:
        limit = max_results
    
    news = db.get_all_news(limit=limit, skip=skip, sort_by=sort_by, sort_order=sort_order)
    return {"count": len(news), "data": json.loads(JSONEncoder().encode(news))}

@router.get("/news/category/{category}", dependencies=[Depends(rate_limit_middleware)])
async def get_news_by_category(
    request: Request,
    category: str,
    limit: int = Query(20, ge=1),
    skip: int = Query(0, ge=0)
):
    """
    Get news by category
    """
    # Apply tier-based limits
    max_results = request.state.max_results
    if limit > max_results:
        limit = max_results
        
    news = db.get_news_by_category(category=category, limit=limit, skip=skip)
    if not news:
        return {"count": 0, "data": []}
    return {"count": len(news), "data": json.loads(JSONEncoder().encode(news))}

@router.get("/news/search", dependencies=[Depends(rate_limit_middleware)])
async def search_news(
    request: Request,
    query: str,
    limit: int = Query(20, ge=1),
    skip: int = Query(0, ge=0)
):
    """
    Search news by query
    """
    # Apply tier-based limits
    max_results = request.state.max_results
    if limit > max_results:
        limit = max_results
        
    news = db.search_news(query=query, limit=limit, skip=skip)
    return {"count": len(news), "data": json.loads(JSONEncoder().encode(news))}

@router.get("/news/latest", dependencies=[Depends(rate_limit_middleware)])
async def get_latest_news(
    request: Request,
    limit: int = Query(10, ge=1)
):
    """
    Get the latest news
    """
    # Apply tier-based limits
    max_results = request.state.max_results
    if limit > max_results:
        limit = max_results
        
    news = db.get_all_news(limit=limit, sort_by="timestamp_iso", sort_order=-1)
    return {"count": len(news), "data": json.loads(JSONEncoder().encode(news))}

@router.get("/news/source/{source}", dependencies=[Depends(rate_limit_middleware)])
async def get_news_by_source(
    request: Request,
    source: str,
    limit: int = Query(20, ge=1),
    skip: int = Query(0, ge=0)
):
    """
    Get news by source (e.g., Economic Times, Bloomberg Quint)
    """
    # Apply tier-based limits
    max_results = request.state.max_results
    if limit > max_results:
        limit = max_results
        
    cursor = db.collection.find({"source": source}).sort("timestamp_iso", -1).skip(skip).limit(limit)
    news = list(cursor)
    return {"count": len(news), "data": json.loads(JSONEncoder().encode(news))}
