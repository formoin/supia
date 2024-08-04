import os
from aspose.svg import *
from aspose.svg.drawing import *
from aspose.svg.rendering.image import *
from aspose.svg.imagevectorization import *
import aspose.words as aw

# Configuration for image vectorization
path_builder = BezierPathBuilder()
path_builder.trace_smoother = ImageTraceSmoother()  # Example severity level
path_builder.error_threshold = 0.01  # Example threshold
path_builder.max_iterations = 2000  # Example max iterations

vectorizer = ImageVectorizer()
vectorizer.configuration.path_builder = path_builder
vectorizer.configuration.colors_limit = 1024  # Example color limit
vectorizer.configuration.line_width = 0.1  # Example line width

input_path = "../img/seg/"
input_img = "segment1.jpg"
output_path = "../img/output/"
output_svg = "output1.svg"
output_img = "vactor_image.jpg"

# Vectorize an image
src_file = input_path + input_img # Specify the sourse image file
with vectorizer.vectorize(src_file) as document:
    output_file = os.path.join(output_path, output_svg)  # Specify the output SVG file
    document.save(output_file)

print(f"Vectorized image saved to {output_file}")


doc = aw.Document()
builder = aw.DocumentBuilder(doc)

shape = builder.insert_image(output_path + output_svg)
shape.get_shape_renderer().save(output_img, aw.saving.ImageSaveOptions(aw.SaveFormat.PNG))

