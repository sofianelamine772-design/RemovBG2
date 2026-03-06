from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove, new_session
import io
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Pro BG Remover API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pre-load the session for high-quality processing
# isnet-general-use is much more precise than u2net for complex subjects
model_name = "isnet-general-use"
session = new_session(model_name)

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    # Check file size (increased to 20MB for high-res source images)
    MAX_SIZE = 20 * 1024 * 1024  
    
    try:
        # Read the image file
        content = await file.read()
        
        if len(content) > MAX_SIZE:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 20MB.")

        # Performance logging
        logger.info(f"Processing image: {file.filename}")

        # Use rembg with Advanced Alpha Matting for surgical precision
        # alpha_matting helps significantly with hair and fuzzy edges
        output_data = remove(
            content, 
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        
        # Return the transparent PNG
        return Response(content=output_data, media_type="image/png")

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Pro BG Remover API is running", "model": model_name, "mode": "Ultra Quality (Alpha Matting ON)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
