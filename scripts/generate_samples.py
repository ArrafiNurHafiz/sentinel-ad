import os
import io
from PIL import Image, ImageDraw

def generate_sample_assets():
    target_dir = "/home/arrafi/lomba/Kartikacyber/assets/samples"
    os.makedirs(target_dir, exist_ok=True)

    # 1. Sample Deepfake Speech Face (with visible artifacts on mouth/jaw)
    fake_img = Image.new("RGB", (512, 512), color=(20, 25, 40))
    draw_fake = ImageDraw.Draw(fake_img)
    # Head contour
    draw_fake.ellipse([140, 90, 370, 420], fill=(215, 165, 135), outline=(15, 23, 42), width=4)
    # Eyes
    draw_fake.ellipse([180, 180, 230, 220], fill=(255, 255, 255))
    draw_fake.ellipse([195, 190, 215, 210], fill=(20, 30, 50))
    draw_fake.ellipse([280, 180, 330, 220], fill=(255, 255, 255))
    draw_fake.ellipse([295, 190, 315, 210], fill=(20, 30, 50))
    # Spliced mouth / GAN boundary
    draw_fake.rectangle([200, 310, 310, 360], fill=(180, 75, 85), outline=(239, 68, 68), width=3)
    draw_fake.text((150, 440), "PROVOKASI PIDATO PEJABAT [SYNTHETIC]", fill=(239, 68, 68))
    fake_img.save(os.path.join(target_dir, "sample_deepfake_speech.jpg"), quality=95)

    # 2. Sample Authentic Official Speech Face
    auth_img = Image.new("RGB", (512, 512), color=(15, 30, 25))
    draw_auth = ImageDraw.Draw(auth_img)
    # Head contour
    draw_auth.ellipse([140, 90, 370, 420], fill=(210, 160, 130), outline=(10, 20, 15), width=3)
    # Eyes
    draw_auth.ellipse([180, 180, 230, 220], fill=(255, 255, 255))
    draw_auth.ellipse([195, 190, 215, 210], fill=(15, 25, 20))
    draw_auth.ellipse([280, 180, 330, 220], fill=(255, 255, 255))
    draw_auth.ellipse([295, 190, 315, 210], fill=(15, 25, 20))
    # Natural mouth
    draw_auth.arc([210, 310, 300, 360], start=0, end=180, fill=(160, 60, 70), width=4)
    draw_auth.text((150, 440), "SIARAN RESMI DISPENAD [AUTHENTIC]", fill=(16, 185, 129))
    auth_img.save(os.path.join(target_dir, "sample_authentic_speech.jpg"), quality=95)

    print("✅ Sample media generated successfully in assets/samples/")

if __name__ == "__main__":
    generate_sample_assets()
