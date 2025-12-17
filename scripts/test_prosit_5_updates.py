"""
Quick test script to verify the Prosit 5 notebook changes work correctly
"""

import pandas as pd
import sys


def test_data_loading():
    """Test that the transcript data loads correctly"""
    print("=" * 60)
    print("TEST 1: Loading Transcript Data")
    print("=" * 60)

    try:
        df_main = pd.read_csv("../data/prosit 1/anon_Transcript_Reports_v2.csv")
        print(f"✅ Data loaded successfully")
        print(f"   Shape: {df_main.shape}")
        print(f"   Unique students: {df_main['StudentRef'].nunique()}")
        print(f"   Columns: {list(df_main.columns)}")

        # Check for required columns
        required_cols = [
            "StudentRef",
            "Grade",
            "Course Name",
            "GPA",
            "CGPA",
            "Semester/Year",
        ]
        missing = [col for col in required_cols if col not in df_main.columns]

        if missing:
            print(f"❌ Missing required columns: {missing}")
            return False
        else:
            print(f"✅ All required columns present")

        return True
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return False


def test_admissions_data():
    """Test that admissions data loads"""
    print("\n" + "=" * 60)
    print("TEST 2: Loading Admissions Data")
    print("=" * 60)

    try:
        import glob

        admissions_files = glob.glob("../data/prosit 5/*_C2023-C2028-anon.csv")
        print(f"✅ Found {len(admissions_files)} admissions files")

        # Test loading one file
        if admissions_files:
            df = pd.read_csv(admissions_files[0])
            print(f"   Sample file shape: {df.shape}")
            print(f"   Has StudentRef: {'StudentRef' in df.columns}")

        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_merge_simulation():
    """Simulate the merge to check for issues"""
    print("\n" + "=" * 60)
    print("TEST 3: Simulating Data Merge")
    print("=" * 60)

    try:
        # Load main data
        df_main = pd.read_csv("../data/prosit 1/anon_Transcript_Reports_v2.csv")

        # Load one admissions file as test
        import glob

        admissions_files = glob.glob("../data/prosit 5/*_C2023-C2028-anon.csv")

        if admissions_files:
            df_admissions = pd.read_csv(admissions_files[0])

            # Test merge
            df_test = df_main.merge(
                df_admissions, on="StudentRef", how="left", suffixes=("", "_admissions")
            )

            print(f"✅ Merge successful")
            print(f"   Original shape: {df_main.shape}")
            print(f"   Merged shape: {df_test.shape}")
            print(
                f"   Students with admissions data: {df_test['Yeargroup'].notna().sum()}"
            )

            # Check if we still have required columns
            if "GPA" in df_test.columns and "CGPA" in df_test.columns:
                print(f"✅ Required columns (GPA, CGPA) preserved after merge")
            else:
                print(f"❌ Required columns missing after merge")
                return False

        return True
    except Exception as e:
        print(f"❌ Error during merge: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\n🔍 Testing Prosit 5 Notebook Updates\n")

    results = []
    results.append(("Data Loading", test_data_loading()))
    results.append(("Admissions Data", test_admissions_data()))
    results.append(("Merge Simulation", test_merge_simulation()))

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")

    all_passed = all(result[1] for result in results)

    if all_passed:
        print("\n✅ All tests passed! The notebook should work correctly.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Please review the errors above.")
        sys.exit(1)
