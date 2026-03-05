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

# Pre-load the session for faster processing
session = new_session("u2net")

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    # Check file size (optional limit, e.g., 10MB)
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    
    try:
        # Read the image file
        content = await file.read()
        
        if len(content) > MAX_SIZE:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")

        # Open image with PIL to verify it's an image
        input_image = Image.open(io.BytesIO(content))
        
        # Performance logging
        logger.info(f"Processing image: {file.filename} ({input_image.size})")

        # Use rembg to remove background
        # Quality is already high by default with u2net
        output_data = remove(content, session=session)
        
        # Return the transparent PNG
        return Response(content=output_data, media_type="image/png")

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Pro BG Remover API is running", "model": "u2net"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
