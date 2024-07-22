import os
from aspose.svg import *
from aspose.svg.drawing import *
from aspose.svg.rendering.image import *
from aspose.svg.imagevectorization import *

# Configuration for image vectorization
path_builder = BezierPathBuilder()
path_builder.trace_smoother = ImageTraceSmoother(1)  # Example severity level
path_builder.error_threshold = 10.0  # Example threshold
path_builder.max_iterations = 20  # Example max iterations

vectorizer = ImageVectorizer()
vectorizer.configuration.path_builder = path_builder
vectorizer.configuration.colors_limit = 50  # Example color limit
vectorizer.configuration.line_width = 2.0  # Example line width

# Vectorize an image
src_file = "segment2.jpg"  # Specify the sourse image file
with vectorizer.vectorize(src_file) as document:
    output_file = os.path.join("output.svg")  # Specify the output SVG file
    document.save(output_file)

print(f"Vectorized image saved to {output_file}")
