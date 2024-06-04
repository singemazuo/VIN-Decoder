import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./VinForm.module.css";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import PhotoUpload from "./PhotoUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const VinForm = () => {
  const [vin, setVin] = useState("");
  const [result, setResult] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [photos, setPhotos] = useState([]);
  const [fields, setFields] = useState({
    Year: "",
    Make: "",
    Model: "",
    Transmission: "",
    Weight: "",
    ExteriorColor: "",
    InteriorColor: "",
    EngineBrake: "",
    Engine: "",
    Doors: "",
    Fuel: "",
    Title: "",
    FrontAirbags: "",
    KneeAirbags: "",
    SideAirbags: "",
    CurtainAirbags: "",
    SeatCushionAirbags: "",
    OtherRestraintInfo: "",
    PlantInfo: "",
    PurchasePrice: "",
    SalePrice: "",
  });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!vin.trim()) {
      console.log("VIN is empty, clearing form fields");
      setFields({
        Year: "",
        Make: "",
        Model: "",
        Transmission: "",
        Weight: "",
        ExteriorColor: "",
        InteriorColor: "",
        EngineBrake: "",
        Engine: "",
        Doors: "",
        Fuel: "",
        Title: "",
        FrontAirbags: "",
        KneeAirbags: "",
        SideAirbags: "",
        CurtainAirbags: "",
        SeatCushionAirbags: "",
        OtherRestraintInfo: "",
        PlantInfo: "",
        PurchasePrice: "",
        SalePrice: "",
      });
      setResult(null);
      setLogoUrl("");
      setShowForm(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/decode_vin", {
        vin,
      });
      console.log("API Response:", response.data);
      setResult(response.data);
      fetchLogo(response.data.Make);

      const stockNumber = vin.slice(-6);

      setFields({
        Year: response.data.Year || "",
        Make: response.data.Make || "",
        Model: response.data.Model || "",
        Transmission: response.data.Transmission || "",
        Weight: response.data.Weight || "",
        ExteriorColor: response.data.ExteriorColor || "",
        InteriorColor: response.data.InteriorColor || "",
        EngineBrake: response.data.EngineBrake || "",
        Engine: response.data.Engine || "",
        Doors: response.data.Doors || "",
        Fuel: response.data.Fuel || "",
        Title: response.data.Title || "",
        FrontAirbags: response.data.Airbags?.Front || "",
        KneeAirbags: response.data.Airbags?.Knee || "",
        SideAirbags: response.data.Airbags?.Side || "",
        CurtainAirbags: response.data.Airbags?.Curtain || "",
        SeatCushionAirbags: response.data.Airbags?.SeatCushion || "",
        OtherRestraintInfo: response.data.Airbags?.OtherRestraintInfo || "",
        PlantInfo: response.data.PlantInfo || "",
        StockNumber: stockNumber,
        PurchasePrice: "",
        SalePrice: "",
      });
      setShowForm(true);
    } catch (error) {
      console.error("Error decoding VIN:", error);
      setResult({ error: "Error decoding VIN" });
    }
  };

  const fetchLogo = async (make) => {
    try {
      console.log("Fetching logo for make:", make);
      const formattedMake = make.toLowerCase();
      const logoResponse = await axios.get(
        `https://logo.clearbit.com/${formattedMake}.com`
      );
      setLogoUrl(logoResponse.config.url);
    } catch (error) {
      console.error("Error fetching logo for make:", make, error);
      setLogoUrl("/path/to/placeholder/logo.png");
    }
  };

  const handleFieldChange = (field, value) => {
    setFields({
      ...fields,
      [field]: value,
    });
  };

  const handlePhotosChange = (photos) => {
    setPhotos(photos);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("vin", vin);
    formData.append("year", fields.Year);
    formData.append("make", fields.Make);
    formData.append("model", fields.Model);
    formData.append("transmission", fields.Transmission);
    formData.append("weight", fields.Weight);
    formData.append("exteriorColor", fields.ExteriorColor);
    formData.append("interiorColor", fields.InteriorColor);
    formData.append("engineBrake", fields.EngineBrake);
    formData.append("engine", fields.Engine);
    formData.append("doors", fields.Doors);
    formData.append("stockNumber", fields.StockNumber);
    formData.append("fuel", fields.Fuel);
    formData.append("title", fields.Title);
    formData.append("frontAirbags", fields.FrontAirbags);
    formData.append("kneeAirbags", fields.KneeAirbags);
    formData.append("sideAirbags", fields.SideAirbags);
    formData.append("curtainAirbags", fields.CurtainAirbags);
    formData.append("seatCushionAirbags", fields.SeatCushionAirbags);
    formData.append("otherRestraintInfo", fields.OtherRestraintInfo);
    formData.append("plantInfo", fields.PlantInfo);
    formData.append("purchasePrice", fields.PurchasePrice);
    formData.append("salePrice", fields.SalePrice);

    photos.forEach((photo, index) => {
      formData.append(`photos`, photo);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/submit_vehicle",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Submit Response:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error submitting vehicle data:", error);
    }
  };

  const handleEnterManually = () => {
    setShowForm(true);
  };

  return (
    <div className={styles.sideBar}>
        <Sidebar/>
        <div className={styles.navBar}>
            <NavigationBar/>
            <div className={styles.vinContainer}>
        <form onSubmit={handleSubmit}>
          <br />
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="Enter VIN here"
              className={styles.vinSearchInput}
            />
            <button type="submit" className={styles.vinSubmitButton}>
              Search VIN
            </button>
          </div>
        </form>
        <hr />
        <div className={styles.centerButton}>
          <button onClick={handleEnterManually} className={styles.button5}>
            Enter Manually&nbsp;
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
        </div>
        {showForm && (
          <div>
            <hr />
            <div className={styles.logoAndDetails}>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={`${result?.Make} logo`}
                  className={styles.carLogo}
                />
              )}
              <div className={styles.detailsText}>
                {result?.Year} {result?.Make} {result?.Model}
              </div>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Year:</label>
                <input
                  type="text"
                  value={fields.Year}
                  onChange={(e) => handleFieldChange("Year", e.target.value)}
                  required
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Make:</label>
                <input
                  type="text"
                  value={fields.Make}
                  onChange={(e) => handleFieldChange("Make", e.target.value)}
                  required
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Model:</label>
                <input
                  type="text"
                  value={fields.Model}
                  onChange={(e) => handleFieldChange("Model", e.target.value)}
                  required
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Transmission:</label>
                <input
                  type="text"
                  value={fields.Transmission}
                  onChange={(e) =>
                    handleFieldChange("Transmission", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Weight:</label>
                <input
                  type="text"
                  value={fields.Weight}
                  onChange={(e) => handleFieldChange("Weight", e.target.value)}
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Exterior Color:</label>
                <input
                  type="text"
                  value={fields.ExteriorColor}
                  onChange={(e) =>
                    handleFieldChange("ExteriorColor", e.target.value)
                  }
                  required
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Interior Color:</label>
                <input
                  type="text"
                  value={fields.InteriorColor}
                  onChange={(e) =>
                    handleFieldChange("InteriorColor", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Engine Brake:</label>
                <input
                  type="text"
                  value={fields.EngineBrake}
                  onChange={(e) =>
                    handleFieldChange("EngineBrake", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Engine:</label>
                <input
                  type="text"
                  value={fields.Engine}
                  onChange={(e) => handleFieldChange("Engine", e.target.value)}
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Doors:</label>
                <input
                  type="text"
                  value={fields.Doors}
                  onChange={(e) => handleFieldChange("Doors", e.target.value)}
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Fuel:</label>
                <input
                  type="text"
                  value={fields.Fuel}
                  onChange={(e) => handleFieldChange("Fuel", e.target.value)}
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Title:</label>
                <input
                  type="text"
                  value={fields.Title}
                  onChange={(e) => handleFieldChange("Title", e.target.value)}
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Front Airbags:</label>
                <input
                  type="text"
                  value={fields.FrontAirbags}
                  onChange={(e) =>
                    handleFieldChange("FrontAirbags", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Knee Airbags:</label>
                <input
                  type="text"
                  value={fields.KneeAirbags}
                  onChange={(e) =>
                    handleFieldChange("KneeAirbags", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Side Airbags:</label>
                <input
                  type="text"
                  value={fields.SideAirbags}
                  onChange={(e) =>
                    handleFieldChange("SideAirbags", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Curtain Airbags:</label>
                <input
                  type="text"
                  value={fields.CurtainAirbags}
                  onChange={(e) =>
                    handleFieldChange("CurtainAirbags", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>
                  Seat Cushion Airbags:
                </label>
                <input
                  type="text"
                  value={fields.SeatCushionAirbags}
                  onChange={(e) =>
                    handleFieldChange("SeatCushionAirbags", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>
                  Other Restraint Info:
                </label>
                <input
                  type="text"
                  value={fields.OtherRestraintInfo}
                  onChange={(e) =>
                    handleFieldChange("OtherRestraintInfo", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Plant Information:</label>
                <input
                  type="text"
                  value={fields.PlantInfo}
                  onChange={(e) =>
                    handleFieldChange("PlantInfo", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Purchase Price</label>
                <input
                  type="text"
                  value={fields.PurchasePrice}
                  onChange={(e) =>
                    handleFieldChange("PurchasePrice", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabels}>Sale Price:</label>
                <input
                  type="text"
                  value={fields.SalePrice}
                  onChange={(e) =>
                    handleFieldChange("SalePrice", e.target.value)
                  }
                  className={styles.formInputBox}
                />
              </div>
              <hr />
              <PhotoUpload onPhotosChange={handlePhotosChange} />
              <button type="submit" className={styles.button6}>
                Submit Vehicle Data
              </button>
            </form>
          </div>
        )}
        {result && result.error && (
          <div>
            <p>{result.error}</p>
          </div>
        )}
      </div>
        </div>
    </div>
  );
};

export default VinForm;
