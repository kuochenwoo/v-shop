from PIL import Image
import sys

def resize_image(input_path, output_path, target_resolution=(1920, 1080)):
    try:
        # 打开原始图片
        original_image = Image.open(input_path)
        
        # 调整分辨率
        resized_image = original_image.resize(target_resolution, Image.ANTIALIAS)
        
        # 保存调整后的图片
        resized_image.save(output_path)
        print(f"图片已成功转换为 {target_resolution} 分辨率，并保存到 {output_path}")
    except Exception as e:
        print(f"发生错误：{e}")

if __name__ == "__main__":
        input_path = sys.argv[1]
        output_path = sys.argv[2]
        
        # 提供目标分辨率（1920x1080）
        target_resolution = (1920, 1080)

        resize_image(input_path, output_path, target_resolution)