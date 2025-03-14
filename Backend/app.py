from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load the trained model
with open("../predictor.pickle", "rb") as f:
    model = pickle.load(f)

def predict_risk(features):
    risk_probability = model.predict([features])[0]

    if risk_probability > 0.6:
        risk_level = "High"
        description = "Transactions with a high probability of being fraudulent. Immediate investigation is required."
        remediation_steps = [
            "1. Block IP/Region if geographic anomalies are detected.",
            "2. Lock account temporarily until verified.",
            "3. Contact the user for transaction verification."
        ]
    elif 0.3 < risk_probability <= 0.6:
        risk_level = "Medium"
        description = "Transactions with a medium fraud probability. Might indicate early signs of fraud."
        remediation_steps = [
            "1. Hold transaction temporarily for validation.",
            "2. Send a security alert to the user.",
            "3. Verify transaction legitimacy based on location."
        ]
    else:
        risk_level = "Low"
        description = "Minimal fraud probability. Aligns with user’s regular patterns."
        remediation_steps = [
            "1. Monitor for behavioral changes.",
            "2. Process transaction normally.",
            "3. Include in regular security audits."
        ]

    return {
        "risk_probability": round(risk_probability * 100, 2),
        "risk_level": risk_level,
        "description": description,
        "remediation_steps": remediation_steps
    }

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = [
        float(data["amt"]),
        int(data["city_pop"]),
        int(data["hour"]),
        float(data["distance_km"])
    ]

    category_list = [
        "category_entertainment", "category_food_dining", "category_gas_transport",
        "category_grocery_net", "category_grocery_pos", "category_health_fitness",
        "category_home", "category_kids_pets", "category_misc_net", "category_misc_pos",
        "category_personal_care", "category_shopping_net", "category_shopping_pos", "category_travel"
    ]
    gender_list = ["gender_F", "gender_M"]

    features += [1 if cat == data["category"] else 0 for cat in category_list]
    features += [1 if gen == data["gender"] else 0 for gen in gender_list]

    # Log the features to ensure they are correct
    print("Features:", features)

    result = predict_risk(features)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pickle

# app = Flask(__name__)
# CORS(app)

# with open("../predictor.pickle", "rb") as f:
#     model = pickle.load(f)

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
#     feature_list = [
#         float(data['amt']), int(data['city_pop']), int(data['hour']), float(data['distance_km'])
#     ]
#     risk_probability = model.predict([feature_list])[0]

#     risk_level = "High" if risk_probability > 0.6 else "Medium" if risk_probability > 0.3 else "Low"
#     descriptions = {
#         "High": "High fraud probability! Immediate action needed.",
#         "Medium": "Medium risk detected. Review recommended.",
#         "Low": "Low risk. No immediate action required."
#     }
#     steps = {
#         "High": ["Block suspicious IP", "Verify user identity", "Monitor account activity"],
#         "Medium": ["Send user alert", "Monitor behavior", "Review manually"],
#         "Low": ["Routine monitoring"]
#     }

#     return jsonify({
#         "probability": risk_probability,
#         "risk_level": risk_level,
#         "description": descriptions[risk_level],
#         "steps": steps[risk_level]
#     })

# if __name__ == '__main__':
#     app.run(debug=True)
