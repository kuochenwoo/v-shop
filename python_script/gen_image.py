
from PIL import Image
import cv2

# Open the input image
img = cv2.imread("C:\\Users\\KCWu\\Desktop\\baraa.jpg", cv2.IMREAD_UNCHANGED)  # Replace with the path to your input image
# scale_percent = 70 # percent of original size
# width = int(img.shape[1] * scale_percent / 100)
# height = int(img.shape[0] * scale_percent / 100)
# dim = (width, height)
  
# # resize image
# resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
 
# print('Resized Dimensions : ',resized.shape)
 
# cv2.imshow("Resized image", resized)
# cv2.waitKey(0)
x = 0
y = 100
h = 320
w = 800
crop_img = img[y:y+h, x:x+w]
# cv2.imshow("cropped", crop_img)
# cv2.waitKey(0)
cv2.imwrite("baraa.jpg", crop_img)