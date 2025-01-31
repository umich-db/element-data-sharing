import os

# 定义 MOM 和 CHILD 文件的关键字列表
mom_keywords = [
    # 原有 MOM 关键词
    'Historical_Anthropometry_(Mom_C123)', 'Historical_Chlorpyrifos_Mom', 'Historical_COMBO_C1_PL_BI_SF_Mothers',
    'Historical_Combo_Delivery_Info_Mom', 'Historical_Diet_Mom_FFQ_NUT', 'Historical_Diet_Mom_FoodGroup_Raw_and_TEI_Adjusted',
    'Historical_Diet_Mom_NUT_TEI_Adjusted', 'Historical_Fl_Fluoride_Plasma_Mom', 'Historical_Fluoride_Urine_SG_Creat_Mom',
    'Historical_HgBlood_Mom_Prenatal', 'Historical_Master_Mom', 'Historical_Mom_Bone_COMBO_Mothers_Rotula_Tibia_union',
    'Historical_Mom_Bone_dxa', 'Historical_Mom_Calcium_Treatment', 'Historical_Mom_FFQ_Fluoride',
    'Historical_Mom_Metals_sg', 'Historical_Mom_Phenols_sg', 'Historical_Mom_Phthalates_sg',
    'Historical_Mom_Psy1_WAIS', 'Historical_Mom_SF', 'Historical_Mom_SF_supplement', 'Historical_Pb_Blood_lead_Mom',
    'Historical_Pb_Breastmilk_lead', 'Historical_Plasma-TSH Assay', 'Historical_Random-Urine Iodine Assay',
    'Historical_SES', 'Historical_Urine_Creatinine_Mom', 'CC_Mother and Children_Pb_Lead', 'CC_Mothers_Antropometry_BP and BI',
    'CC_Mothers_Diet_DII', 'CC_Mothers_Diet+Suppl_DII', 'CC_Mothers_FFQ_Frecuencies', 'CC_Mothers_FFQ_Nutrients',
    'CC_Mothers_FFQ_Vitamins', 'CC_Mothers_HOME_6_10_years_old', 'CC_Mothers_HOME_11_15_years_old', 
    'CC_Mothers_Phenols', 'CC_Mothers_Phthalates', 'CC_Mothers_Samples_Lipidos', 'CC_Mothers_SES',
    'CC_Mothers_Socioeconomic_Quest', 'CC_Mothers_SpecificGravity_EDCs', 'P01_Mother_Fluoride', 'E3G_Actigraphy_output_daily',
    'E3G_Anthropomerty', 'E3G_Blood_Pressure', 'E3G_Blood_Labs', 'E3G_CRP', 'E3G_Cytokine Multiplex', 'E3G_DII',
    'E3G_FFQ_Frecuencies', 'E3G_FFQ_Nutrients', 'E3G_FFQ_Supplements', 'E3G_FFQ_Vitamins', 'E3G_FRAX',
    'E3G_General_Questionnaire', 'E3G_General_Questionnaire_Family Structure', 'E3G_Hormone_Lipids', 'E3G_Inbody',
    'E3G_Menopause', 'E3G_Metabolic_AHA', 'E3G_NIH_Toolbox_Assessment_Scores', 'E3G_Oral_Health_Questionnaire',
    'E3G_Periodontal_Screening', 'E3G_Phenols', 'E3G_Phthalates', 'E3G_Serum_Insulin', 'E3G_SES', 'E3G_Sleep_Diary',
    'E3G_Sleep_PSQI', 'E3G_Specific_Gravity', 'Fatty_Liver_MRI_results', 'FattyLiver_Diet_FFQ', 'FattyLiver_Diet_NUT',
    'FattyLiver_Diet_VIT', 'FattyLiver_General_Questionnaire', 'FattyLiver_Laboratory_Analysis',
    # 新增 MOM 关键词
    'Historical_Anthropometry_(Mom_C123)_102021', 'Historical_Chlorpyrifos_Mom_202010',
    'Historical_COMBO_C1_PL_BI_SF_Mothers_(updt. 2022)', 'Historical_Combo_Delivery_Info_Mom_(032022)',
    'Historical_Diet_Mom_FFQ_NUT(combomothers_nut_sept2011)', 'Historical_Fl_Fluoride_Plasma_Mom(c2c3plasma_051514)',
    'Historical_Fluoride_Urine_SG_Creat_Mom_05.2020', 'Historical_HgBlood_Mom_Prenatal(prenatal)',
    'Historical_Master_Mom(mothers_v2_06sept2010)', 'Historical_Mom_Bone_dxa&sos_(SF Only)',
    'Historical_Mom_Metals_sg_092021', 'Historical_Mom_Phenols_sg_102021', 'Historical_Mom_Phthalates_sg_102021',
    'Historical_Mom_Psy1_WAIS (updt. 112022)', 'Historical_Mom_SF(SF_MOTHERS_2015)', 'Historical_Mom_SF_supplement(SF_MOTHERS_supl)',
    'Historical_Pb_Breastmilk_lead_upt_06.13.2023', 'E3G_Actigraphy_outputs_weekend_weekday',
    'E3G_Blood Pressure_(Presion_arterial)_07.2023_v1F0', 'E3G_General_Questionnaire_(Cuestionario_General)_07.2023_v1F0',
    'E3G_FRAX_(Herramienta_Evaluación_Riesgo_de_fractura)_07.2023_v1F0', 'E3G_Caratula_11.09.21_F0_Covidcall',
    'E3G_Cuestionario_General_11.09.21_F0_Covidcall', 'E3G_Physical_Activity_IPAQ_11232021_F0_Covidcall',
    'E3G_Salud_Oral_11.09.21_F0_Covidcall','E3G_GGIR_Output_No_Diary_Alt_cutoffs','E3G_GGIR_Output_No_Diary_Alt_cutoffs_weekday_end','E3G_GGIR_Output_Alt_cutoffs'
]

child_keywords = ['E3G_FFQ_Vitaminas_072020_v1F1', 'P01_SES_201910', 'P01_Sleep_Calculations_Wide_202109', 'P01_Sleep_Difficulties_062019_(T2 Only)', 'P01_Epigenetic_age_(new clocks)', 'P20_Diet+SUPPL_CDII_202202', 'E3G_NIH_Toolbox_Assessment_Data_072020_v1F1',
    'Historical_Anthropometry_(children_z_score_anthro_clean_2.2021)', 'Historical_Children_FFQ_Fluoride',
    'Historical_Children_Psy1_McCarthy', 'Historical_Children_Psy2_Bayley', 'Historical_Children_Psy3_HOME',
    'Historical_children_Sex and DOB', 'Historical_COMBO_C1_PL_BI_SF_Children', 'Historical_CordBlood_DNA_Methylation',
    'Historical_Diet_Child_FFQ', 'Historical_Diet_Child_FoodGroup_Raw_and_TEI_Adjusted', 'Historical_Diet_Child_NUT',
    'Historical_Diet_Child_NUT_TEI_Adjusted', 'Historical_Master_Child', 'Historical_Pb_Blood_lead_Child', 
    'CC_Children_Anthropometry_with_BMI', 'CC_Children_Bioelectrical_Impedance', 'CC_Children_Blood_Pressure', 
    'CC_Children_Diet_CDII', 'CC_Children_Diet+Suppl_CDII', 'CC_Children_FFQ_Fluoride', 'CC_Children_FFQ_Frequencies', 
    'CC_Children_FFQ_Nutrients', 'CC_Children_FFQ_Vitamins', 'CC_Children_Psy1_CANTAB', 'CC_Children_Psy2_WRAVMA',
    'CC_Children_Psy3_BASC-2', 'CC_Children_Psy5_BRIEF', 'CC_Children_Psy6_WASI', 'CC_Children_Psy7_Connors_CPT-II',
    'CC_Children_Samples_Lipid', 'CC_Children_Sexual_Maturation', 'CC_Children_Skin_Folds', 'CC_Children_UR_Fluoride_SG.adj',
    'P20_Anthropometry_with_BMI', 'P20_Child_Metal_sg', 'P20_Child_Phenols', 'P20_Child_Phthalates_sg', 'P20_Diet_CDII',
    'P20_Diet_FFQ', 'P20_Diet_FoodGroup_Raw_and_TEI_Adjusted', 'P20_Diet_NUT', 'P20_Diet_VIT', 'P20_DNA_Methylation',
    'P20_EpigeneticAge_Children', 'P20_Hormone_Lipids', 'P20_Lead_Mom', 'P20_Master_File', 'P20_Maturation',
    'P20_Metabolites_QCadj_KNN5', 'P20_Oxidative_Stress', 'P20_Physical_Activity_with_METS', 'P20_Telemere', 
    'P01_Accelerometry', 'P01_Anthropometry_w.BMI_zscores', 'P01_Blood_Lab_Basic', 'P01_child_fatty_acid_plasma', 
    'P01_Child_Fluoride', 'P01_Children_lead', 'P01_ConnersCPT3_Simplified_Data', 'P01_CRP', 'P01_Cytokine Multiplex', 
    'P01_Dental_Fluorosis', 'P01_Diet_CDII', 'P01_Diet_DII', 'P01_Diet_FFQ', 'P01_Diet_FISH_FFQ', 'P01_Diet_FoodGroup_Raw_and_TEIAdj', 
    'P01_Diet_NUT', 'P01_Diet_NUT_TEI_Adjusted', 'P01_Diet_VIT', 'P01_DNA_Methylation_T1', 'P01_Epigenetic Age',
    'P01_EpigeneticAge_children', 'P01_Fluoride_Intake', 'P01_Fluoride_Plasma', 'P01_Fluoride_Urine', 'P01_General_Questionnaire', 
    'P01_GPS', 'P01_Hormone_Lipids', 'P01_Inbody', 'P01_Metab_Named_Logscale', 'P01_Metals Urine_T1', 'P01_NIH_Toolbox_Assessment_Scores',
    'P01_Oxidative_Stress', 'P01_PAH_CHEAR_2016_Final', 'P01_Phenols_T1', 'P01_Phthalate_T1', 'P01_Physical_Activity', 
    'P01_Sleep Calculations', 'P01_Sleep Difficulties', 'P01_Telomere_Lenght', 'E3G_AMAI', 'E3G_Anthropometry', 
    'E3G_FFQ_Frecuencies', 'E3G_General_Questionnaire', 'E3G_Inbody', 'E3G_Laboratorio', 'FattyLiver_Diet_FFQ', 
    'FattyLiver_Diet_NUT', 'FattyLiver_General_Questionnaire', 'FattyLiver_Laboratory_Analysis'
]

def classify_folders(base_path='.'):
    """
    """
    for folder_name in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder_name)
        
        if os.path.isdir(folder_path):
            classify_content = None

            if any(keyword in folder_name for keyword in mom_keywords):
                classify_content = 'MOM'
            elif any(keyword in folder_name for keyword in child_keywords):
                classify_content = 'CHILD'

            if classify_content:
                classify_file_path = os.path.join(folder_path, 'classify.txt')
                with open(classify_file_path, 'w') as f:
                    f.write(classify_content)
                print(f"Created classify.txt for {folder_name} with content: {classify_content}")
            else:
                print(f"No classification found for {folder_name}. Please verify manually.")

classify_folders()
