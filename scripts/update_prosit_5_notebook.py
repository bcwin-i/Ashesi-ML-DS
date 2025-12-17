"""
Script to update Prosit 5 notebook to use transcript data instead of merged_cleaned_encoded.csv
"""

import json
import sys


def update_prosit_5_notebook():
    notebook_path = "../notebooks/prosit_5.ipynb"

    # Read the notebook
    with open(notebook_path, "r") as f:
        notebook = json.load(f)

    changes_made = []

    # Update Section 2.1: Change data source
    for i, cell in enumerate(notebook["cells"]):
        if cell["cell_type"] == "code" and "source" in cell:
            source = "".join(cell["source"])

            # Find and update the data loading cell
            if "df_main = pd.read_csv('../data/merged_cleaned_encoded.csv')" in source:
                cell["source"] = [
                    "# Load main student data - using transcript data for course-level details\n",
                    "df_main = pd.read_csv('../data/prosit 1/anon_Transcript_Reports_v2.csv')\n",
                    "print(f'Main data shape: {df_main.shape}')\n",
                    "print(f'Unique students: {df_main[\"StudentRef\"].nunique()}')\n",
                    "print(f'Columns: {list(df_main.columns)}')\n",
                    "df_main.head()",
                ]
                changes_made.append(f"Cell {i}: Updated data source to transcript data")
                # Clear the output since it will be outdated
                cell["outputs"] = []
                cell["execution_count"] = None

            # Update column references: CGPA_y -> CGPA, GPA_y -> GPA, Semester/Year_y -> Semester/Year
            elif any(col in source for col in ["CGPA_y", "GPA_y", "Semester/Year_y"]):
                original_source = source
                source = source.replace("'CGPA_y'", "'CGPA'")
                source = source.replace('"CGPA_y"', '"CGPA"')
                source = source.replace("'GPA_y'", "'GPA'")
                source = source.replace('"GPA_y"', '"GPA"')
                source = source.replace("'Semester/Year_y'", "'Semester/Year'")
                source = source.replace('"Semester/Year_y"', '"Semester/Year"')

                if source != original_source:
                    cell["source"] = source.split("\n")
                    # Ensure each line ends with \n except the last
                    cell["source"] = [
                        line + "\n" if i < len(cell["source"]) - 1 else line
                        for i, line in enumerate(cell["source"])
                    ]
                    changes_made.append(f"Cell {i}: Updated column references")
                    cell["outputs"] = []
                    cell["execution_count"] = None

    # Find the cell after AJC features and before the filtering cell
    # Add a new cell to create df_master
    insert_index = None
    for i, cell in enumerate(notebook["cells"]):
        if cell["cell_type"] == "code" and "source" in cell:
            source = "".join(cell["source"])
            if "df_ajc_features.head()" in source:
                insert_index = i + 1
                break

    if insert_index:
        # Check if df_master creation cell already exists
        next_cell_source = (
            "".join(notebook["cells"][insert_index]["source"])
            if insert_index < len(notebook["cells"])
            else ""
        )

        if (
            "df_master" not in next_cell_source
            or "Before filtering" in next_cell_source
        ):
            # Insert new cell to create df_master
            new_cell = {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# Merge transcript data with admissions data\n",
                    "df_master = df_main.merge(\n",
                    "    df_admissions, \n",
                    "    on='StudentRef', \n",
                    "    how='left',\n",
                    "    suffixes=('', '_admissions')\n",
                    ")\n",
                    "\n",
                    "# Merge with AJC features\n",
                    "df_master = df_master.merge(\n",
                    "    df_ajc_features,\n",
                    "    on='StudentRef',\n",
                    "    how='left'\n",
                    ")\n",
                    "\n",
                    "# Fill missing AJC values with 0 (students with no AJC cases)\n",
                    "ajc_cols = ['ajc_case_count', 'ajc_academic_count', 'ajc_social_count', 'has_ajc_case']\n",
                    "df_master[ajc_cols] = df_master[ajc_cols].fillna(0)\n",
                    "\n",
                    'print(f"Master dataset created: {df_master.shape}")\n',
                    "print(f\"Unique students: {df_master['StudentRef'].nunique()}\")\n",
                    'print(f"Columns: {list(df_master.columns)}")',
                ],
            }

            # Add markdown cell before it
            markdown_cell = {
                "cell_type": "markdown",
                "metadata": {},
                "source": ["### 3.4 Merge All Data"],
            }

            notebook["cells"].insert(insert_index, markdown_cell)
            notebook["cells"].insert(insert_index + 1, new_cell)
            changes_made.append(
                f"Inserted new cells at index {insert_index}: Section 3.4 - Create df_master"
            )

    # Save the updated notebook
    with open(notebook_path, "w") as f:
        json.dump(notebook, f, indent=2)

    print("✅ Notebook updated successfully!")
    print("\nChanges made:")
    for change in changes_made:
        print(f"  - {change}")

    return len(changes_made)


if __name__ == "__main__":
    try:
        num_changes = update_prosit_5_notebook()
        print(f"\n✅ Total changes: {num_changes}")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
