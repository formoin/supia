import numpy as np
from PIL import Image
import potrace
import svgwrite

def png_to_svg(png_path, svg_path):
    # 이미지 로드 및 그레이스케일로 변환
    image = Image.open(png_path).convert('L')

    # 이미지를 numpy 배열로 변환
    image_array = np.array(image)

    # 이진화 (흑백 이미지로 변환)
    binary_image_array = (image_array < 128).astype(np.uint8) * 255

    # potrace를 사용하여 비트맵을 벡터화
    bitmap = potrace.Bitmap(binary_image_array)
    path = bitmap.trace()

    # SVG 작성
    dwg = svgwrite.Drawing(svg_path, profile='tiny')

    # SVG에 벡터 경로 추가
    for curve in path:
        d = []
        for segment in curve:
            if isinstance(segment, potrace.BezierSegment):
                # BezierSegment의 좌표 접근
                start_point = segment.start_point
                control1 = segment.control_point1
                control2 = segment.control_point2
                end_point = segment.end_point
                d.append(f"M{start_point[0]},{start_point[1]} C{control1[0]},{control1[1]} {control2[0]},{control2[1]} {end_point[0]},{end_point[1]}")
           
        if d:
            dwg.add(dwg.path(d=" ".join(d), fill='none', stroke='black'))

    dwg.save()
    print(f"SVG file saved to {svg_path}")

# 사용 예
png_to_svg('./img/input/image.jpg', 'output.svg')
