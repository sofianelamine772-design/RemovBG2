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
async def remove_background(file: UploadFile = File(...), quality: str = "preview"):
    # Check file size (increased to 20MB for high-res source images)
    MAX_SIZE = 20 * 1024 * 1024  
    
    try:
        # Read the image file
        content = await file.read()
        
        if len(content) > MAX_SIZE:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 20MB.")

        # Performance logging
        logger.info(f"Processing image: {file.filename} (Quality: {quality})")

        img_to_process = content
        
        # If preview quality, resize to save resources and offer as free tier
        if quality == "preview":
            input_image = Image.open(io.BytesIO(content))
            # Resize for preview (e.g., max 500px)
            input_image.thumbnail((500, 500))
            
            # Convert back to bytes for rembg
            img_byte_arr = io.BytesIO()
            input_image.save(img_byte_arr, format='PNG')
            img_to_process = img_byte_arr.getvalue()

        # Use rembg with Advanced Alpha Matting for surgical precision
        output_data = remove(
            img_to_process, 
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

import stripe
import os

# Stripe Configuration (User needs to set STRIPE_SECRET_KEY in .env)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_51... (Remplacez par votre clé)")
YOUR_DOMAIN = "http://localhost:5173" # Frontend URL

@app.post("/create-checkout-session")
async def create_checkout_session(plan_type: str):
    try:
        if plan_type == "pro":
            # Pricing: 19.99€/month
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price_data': {
                            'currency': 'eur',
                            'product_data': {
                                'name': 'MagicCut PRO (Illimité)',
                                'description': 'Accès illimité à toutes les fonctions de détourage.',
                            },
                            'unit_amount': 1999,
                            'recurring': {'interval': 'month'},
                        },
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=YOUR_DOMAIN + '?success=true',
                cancel_url=YOUR_DOMAIN + '?canceled=true',
            )
        elif plan_type == "credit":
            # Pricing: 0.99€ per credit (1 unit)
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price_data': {
                            'currency': 'eur',
                            'product_data': {
                                'name': 'Pack 1 Crédit (2 détourages)',
                                'description': 'Un crédit rechargeable pour 2 images.',
                            },
                            'unit_amount': 99,
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=YOUR_DOMAIN + '?success=true',
                cancel_url=YOUR_DOMAIN + '?canceled=true',
            )
        else:
            raise HTTPException(status_code=400, detail="Plan invalide")

        return {"url": checkout_session.url}
    except Exception as e:
        logger.error(f"Error creating Stripe session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Pro BG Remover API is running", "model": model_name, "mode": "Ultra Quality (Alpha Matting ON)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
