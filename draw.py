from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os
from sklearn.cluster import KMeans

# 사용할 CPU 최대 코어 수 설정
os.environ['LOKY_MAX_CPU_COUNT'] = '4' 


def color_crayon_style(image_path, output_path):
    # 주어진 경로에서 이미지를 열고 처리
    with Image.open(image_path) as img:
        # Step 1: 이미지를 RGB로 변환
        img = img.convert("RGB")
        
        # Step 2: 엣지(가장자리) 검출
        edges = detect_edges(img)
        img = img.filter(ImageFilter.BoxBlur(radius=1))
        # Step 3: 색상 단순화
        img = simplify_colors(img)
        
        # Step 4: 엣지와 색상 결합
        # combined_image = Image.composite(img, edges, edges.convert("L"))
        combined_image = img
        
        # 최종 이미지 저장
        combined_image.save(output_path)
        
        # 최종 이미지 화면에 표시
        combined_image.show()

def detect_edges(image):
    # 이미지 흑백 변환
    gray_image = image.convert("L")
    
    # 엣지 검출
    edges = gray_image.filter(ImageFilter.FIND_EDGES)
    
    # Binary 이미지로 변환
    threshold = 30 # 30 이상의 픽셀을 흰색으로 설정
    binary_edges = edges.point(lambda p: p > threshold and 255)
    
    # 엣지를 위한 RGB 이미지 생성
    edge_color_image = Image.new("RGB", image.size, (255, 255, 255))
    # 흰색 배경에 검은색 엣지 합성
    edge_color_image.paste((0, 0, 0), mask=binary_edges)
    
    return edge_color_image

def simplify_colors(image):
    # 이미지 to numpy 배열 변환
    img_array = np.array(image)
    
    # 단순화할 색상의 수
    num_colors = 16 
    
    # k-means 클러스터링으로 색상 감소
    kmeans = KMeans(n_clusters=num_colors, random_state=0).fit(img_array.reshape(-1, 3))
    
    # 이미지의 각 픽셀을 가장 가까운 클러스터 중심으로 대체
    clustered_img_array = kmeans.cluster_centers_[kmeans.labels_].reshape(img_array.shape).astype(np.uint8)
    
    # numpy 배열 to 이미지 변환
    return Image.fromarray(clustered_img_array)

if __name__ == "__main__":
    input_image_path = r"./img/seg/segment3.jpg"
    output_image_path = r"./img/output/blur_kmeans_image3.jpg"
    color_crayon_style(input_image_path, output_image_path)
