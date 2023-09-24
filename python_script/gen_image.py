
from PIL import Image

# Open the input image
input_image = Image.open("C:\\Users\\KCWu\\Desktop\\h1eb0dBP.jpg")  # Replace with the path to your input image

# Resize the image to 1920x1080
output_image = input_image.resize((1920, 1080), Image.ANTIALIAS)

# Save the resized image
output_image.save("C:\\Users\\KCWu\\Desktop\\output_image7.jpg")  # Replace with the desired output file path