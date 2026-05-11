from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from models import models
from routes import (
    auth_router, test_router, medicine_router,
    booking_router, medicine_request_router, message_router
)
from auth import get_password_hash

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pharmacy & Lab Management API",
    description="Complete API for Pharmacy and Laboratory Management System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(test_router)
app.include_router(medicine_router)
app.include_router(booking_router)
app.include_router(medicine_request_router)
app.include_router(message_router)


@app.on_event("startup")
def startup_event():
    """Auto-create default owner and seed sample data if DB is empty."""
    db = SessionLocal()
    try:
        from models.models import Owner, Test, Medicine

        # Create default owner if not exists
        if not db.query(Owner).first():
            owner = Owner(
                username="admin",
                password_hash=get_password_hash("admin123")
            )
            db.add(owner)
            db.commit()
            print("✅ Default owner created: admin / admin123")

        # Seed Aparna Laboratory tests
        if not db.query(Test).first():
            tests = [
                # Left column
                Test(name="HB (Haemoglobin)", description="Measures haemoglobin levels in blood to check for anaemia and other blood disorders.", price=100.0),
                Test(name="TC (Total Count)", description="Counts total white blood cells to help diagnose infections and immune conditions.", price=120.0),
                Test(name="DC (Differential Count)", description="Differentiates types of white blood cells for infection and disease diagnosis.", price=150.0),
                Test(name="ESR (Erythrocyte Sedimentation Rate)", description="Measures inflammation level in the body; elevated in infections and autoimmune diseases.", price=100.0),
                Test(name="CBP (Complete Blood Picture)", description="Comprehensive blood test measuring all components including RBC, WBC, and platelets.", price=350.0),
                Test(name="MP Kit (Malaria Parasite Test)", description="Rapid diagnostic test to detect malaria parasites in blood.", price=200.0),
                Test(name="Widal Test", description="Serological test for diagnosing typhoid fever caused by Salmonella typhi.", price=200.0),
                Test(name="Platelet Count", description="Counts platelets in blood; important for diagnosing dengue, clotting disorders.", price=150.0),
                Test(name="Montoux Test", description="Skin test to detect tuberculosis (TB) infection or exposure.", price=250.0),
                Test(name="Blood Grouping & RH Typing", description="Determines ABO blood group and Rh factor (positive/negative).", price=150.0),
                Test(name="VDRL (Syphilis Test)", description="Serological test to screen for syphilis infection.", price=200.0),
                Test(name="Bleeding Time", description="Measures the time it takes for bleeding to stop after a small cut.", price=100.0),
                Test(name="Clotting Time", description="Measures how long blood takes to clot, assessing clotting factor function.", price=100.0),
                Test(name="AEC Count (Absolute Eosinophil Count)", description="Counts eosinophils to detect allergies, parasitic infections, and asthma.", price=150.0),
                Test(name="HIV-1 & 2 (HIV Test)", description="Detects antibodies to HIV-1 and HIV-2 viruses for AIDS diagnosis.", price=300.0),
                Test(name="HCV (Hepatitis C Virus)", description="Detects hepatitis C virus antibodies to diagnose HCV infection.", price=350.0),
                Test(name="HbsAg (Hepatitis B Surface Antigen)", description="Detects hepatitis B surface antigen to diagnose active HBV infection.", price=300.0),
                Test(name="Chikungunya Test", description="Serological test to detect chikungunya virus infection.", price=600.0),
                Test(name="Dengue Test", description="Detects dengue NS1 antigen or dengue antibodies (IgM/IgG) in blood.", price=600.0),
                Test(name="Scrub Typhus", description="Detects antibodies against Orientia tsutsugamushi causing scrub typhus fever.", price=700.0),
                Test(name="Blood Sugar - Fasting (F)", description="Measures blood glucose after fasting; used to diagnose diabetes.", price=80.0),
                Test(name="Blood Sugar - Post Prandial (P.P)", description="Measures blood glucose 2 hours after a meal to monitor diabetes.", price=80.0),
                Test(name="Blood Sugar - Random (R)", description="Measures blood glucose at any time regardless of last meal.", price=80.0),
                Test(name="Serum Bilirubin", description="Measures bilirubin levels to assess liver function and detect jaundice.", price=200.0),
                Test(name="Serum Creatinine", description="Measures kidney function by detecting creatinine levels in blood.", price=150.0),
                # Right column
                Test(name="Serum Cholesterol", description="Measures total cholesterol level as a cardiovascular risk indicator.", price=200.0),
                Test(name="Blood Urea", description="Measures urea in blood to assess kidney function and protein metabolism.", price=150.0),
                Test(name="Sodium", description="Measures sodium levels to evaluate electrolyte balance and kidney function.", price=200.0),
                Test(name="Potassium", description="Measures potassium levels for evaluating electrolyte balance and heart health.", price=200.0),
                Test(name="Chlorides", description="Measures chloride levels to assess acid-base balance and hydration.", price=200.0),
                Test(name="Sr. Calcium (Serum Calcium)", description="Measures calcium levels for bone health, nerve, and muscle function.", price=200.0),
                Test(name="Sr. Uric Acid (Serum Uric Acid)", description="Measures uric acid to diagnose gout and monitor kidney function.", price=200.0),
                Test(name="Lipid Profile", description="Comprehensive cholesterol panel measuring HDL, LDL, VLDL, and triglycerides.", price=650.0),
                Test(name="T3, T4, TSH (Thyroid Profile)", description="Evaluates thyroid function by measuring T3, T4, and TSH hormone levels.", price=750.0),
                Test(name="RA Factor Quantity (Rheumatoid Arthritis Factor)", description="Detects RA factor to diagnose rheumatoid arthritis and autoimmune conditions.", price=350.0),
                Test(name="CRP Quantity (C-Reactive Protein)", description="Measures CRP to detect inflammation, infection, or autoimmune disorders.", price=350.0),
                Test(name="Vitamin D & B12", description="Measures Vitamin D3 and Vitamin B12 levels to detect deficiencies.", price=1200.0),
                Test(name="A.S.O Test (Anti-Streptolysin O)", description="Detects antibodies against streptolysin O indicating recent streptococcal infection.", price=350.0),
                Test(name="LFT (Liver Function Test)", description="Comprehensive liver panel measuring enzymes, proteins, and bilirubin.", price=550.0),
                Test(name="Urine Analysis", description="Examines urine for cells, chemicals, and organisms indicating kidney or urinary tract disorders.", price=150.0),
                Test(name="Urine Pregnancy Test", description="Detects hCG hormone in urine to confirm pregnancy.", price=150.0),
                Test(name="Semen Analysis", description="Evaluates sperm count, motility, and morphology for fertility assessment.", price=400.0),
                Test(name="Serum Amylase", description="Measures amylase enzyme levels to diagnose pancreatitis and other pancreatic disorders.", price=350.0),
                Test(name="G.T.T Test (Glucose Tolerance Test)", description="Diagnoses diabetes and gestational diabetes by measuring glucose metabolism.", price=300.0),
                Test(name="HbA1c (Glycated Haemoglobin)", description="Measures average blood sugar over 2-3 months to monitor long-term diabetes control.", price=400.0),
                Test(name="ECG (Electrocardiogram)", description="Records electrical activity of the heart to detect arrhythmias and heart disease.", price=300.0),
                Test(name="APTT (Activated Partial Thromboplastin Time)", description="Evaluates blood clotting pathway to detect bleeding disorders or monitor anticoagulant therapy.", price=300.0),
                Test(name="PT, INR (Prothrombin Time / International Normalised Ratio)", description="Measures time for blood to clot; used to monitor warfarin therapy and liver function.", price=350.0),
            ]
            db.add_all(tests)
            db.commit()
            print("✅ Aparna Laboratory tests seeded (43 tests)")

        # Seed sample medicines
        if not db.query(Medicine).first():
            medicines = [
                Medicine(name="Paracetamol 500mg", description="Pain reliever and fever reducer. Suitable for mild to moderate pain.", price=25.0, stock=200),
                Medicine(name="Amoxicillin 250mg", description="Antibiotic used to treat bacterial infections.", price=85.0, stock=150),
                Medicine(name="Metformin 500mg", description="Oral diabetes medication that helps control blood sugar levels.", price=45.0, stock=100),
                Medicine(name="Atorvastatin 10mg", description="Statin medication to lower cholesterol and reduce cardiovascular risk.", price=120.0, stock=80),
                Medicine(name="Omeprazole 20mg", description="Reduces stomach acid for treating heartburn and acid reflux.", price=60.0, stock=120),
                Medicine(name="Cetirizine 10mg", description="Antihistamine for allergy relief and hay fever symptoms.", price=30.0, stock=180),
            ]
            db.add_all(medicines)
            db.commit()
            print("✅ Sample medicines seeded")
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "message": "Pharmacy & Lab Management API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
