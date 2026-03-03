from qgis.core import (
    QgsVectorLayer, QgsVectorFileWriter, QgsCoordinateReferenceSystem,
    QgsCoordinateTransform, QgsCoordinateTransformContext
)
import processing, os

SOURCE    = "C:/Users/17574/Documents/structures_nad83_edited.gpkg|layername=structures_nad83"
OUTPUT    = "C:/Users/17574/Desktop/Projects/richmond-urban-renewal/data/structures.geojson"
TOLERANCE = 0.000001

layer = QgsVectorLayer(SOURCE, "structures", "ogr")
if not layer.isValid():
    raise Exception("Layer failed to load — check the source path.")

filtered = processing.run("native:extractbyexpression", {
    'INPUT': layer,
    'EXPRESSION': '"CreatedBy" = \'PM\'',
    'OUTPUT': 'TEMPORARY_OUTPUT'
})['OUTPUT']

simplified = processing.run("native:simplifygeometries", {
    'INPUT': filtered,
    'METHOD': 0,
    'TOLERANCE': TOLERANCE,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})['OUTPUT']

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

options = QgsVectorFileWriter.SaveVectorOptions()
options.driverName = "GeoJSON"
options.fileEncoding = "UTF-8"
options.ct = QgsCoordinateTransform(
    simplified.crs(),
    QgsCoordinateReferenceSystem("EPSG:4326"),
    QgsCoordinateTransformContext()
)

QgsVectorFileWriter.writeAsVectorFormatV3(simplified, OUTPUT, QgsCoordinateTransformContext(), options)

print("Done! Exported to: " + OUTPUT)
