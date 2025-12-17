
# 2. Add API endpoint for metrics
@app.get("/prosit3/results/metrics", tags=["Prosit 3 - Probation Risk"])
async def get_prosit3_metrics():
    """Get classification performance metrics"""
    try:
        metrics_file = RESULTS_DIR / "prosit 3" / "classification_metrics.csv"
        df = pd.read_csv(metrics_file)
        return df.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading metrics: {str(e)}")
