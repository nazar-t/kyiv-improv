import 'server-only'; // Ensures this module is only imported on the server

export interface Dictionary {
  lang:string;
  header: {
    home: string;
    courses: string;
    jams_workshops: string;
    faq: string;
    about: string;
    shows: string;
    merch: string;
    improv_club: string;
  };
  button: {
    learn_more: string;
    sign_up: string;
  }
  homepage: {
    welcome_title: string;
    upcoming_student_offerings: string;
    no_upcoming_student_offerings: string;
    upcoming_events: string;
    no_upcoming_events: string;
    our_core_courses: string;
    beginner_improv_title: string;
    beginner_improv_description: string;
    advanced_improv_title: string;
    advanced_improv_description: string;
    gallery_title: string;
    photo: string;
    spots: string;
    full: string;
    contact_us_title: string;
    location_info_title: string;
    location: string;
    address: string;
    phone: string;
    email: string;
    newsletter_signup_title: string;
    newsletter_signup_description: string;
    your_email_placeholder: string;
    subscribe_button: string;
  };
  courses_page: {
    title: string;
    core_curriculum: string;
    curriculum: string;
    price: string;
    times: string;
    sign_up_for_this_course: string;
    upcoming_jams_workshops: string;
    no_upcoming_jams_workshops: string;
    beginner_improv_title: string;
    beginner_curriculum_week_1: string;
    beginner_curriculum_week_2: string;
    beginner_curriculum_week_3: string;
    beginner_curriculum_week_4: string;
    beginner_curriculum_week_5: string;
    beginner_curriculum_week_6: string;
    beginner_times: string;
    advanced_improv_title: string;
    advanced_curriculum_week_1: string;
    advanced_curriculum_week_2: string;
    advanced_curriculum_week_3: string;
    advanced_curriculum_week_4: string;
    advanced_curriculum_week_5: string;
    advanced_curriculum_week_6: string;
    advanced_times: string;
    available_classes: string;
  };
  jams_workshops_page: {
    title: string;
    upcoming_sessions: string;
    no_upcoming_sessions: string;
  };
  faq: {
    title: string;
    general_questions: string;
    what_is_improv_q: string;
    what_is_improv_a: string;
    do_i_need_experience_q: string;
    do_i_need_experience_a: string;
    registration_payment: string;
    how_to_sign_up_q: string;
    how_to_sign_up_a: string;
    payment_methods_q: string;
    payment_methods_a: string;
    online_in_person: string;
    online_in_person_q: string;
    online_in_person_a: string;
  };
  about_page: {
    title: string;
    our_story: string;
    our_story_text: string;
    meet_founders: string;
    founder_name_1: string;
    founder_role_1: string;
    founder_bio_1: string;
    founder_name_2: string;
    founder_role_2: string;
    founder_bio_2: string;
    our_actors_coaches: string;
    actor_coach_name_1: string;
    actor_coach_role_1: string;
    actor_coach_name_2: string;
    actor_coach_role_2: string;
    actor_coach_name_3: string;
    actor_coach_role_3: string;
  };
  shows_page: {
    title: string;
    public_performances: string;
    no_upcoming_shows: string;
  };
  merch_page: {
    title: string;
    check_back_soon: string;
    merch_item_1_title: string;
    merch_item_1_description: string;
    merch_item_2_title: string;
    merch_item_2_description: string;
    merch_item_3_title: string;
    merch_item_3_description: string;
  };
  form: {
    first_name: string;
    last_name: string;
    email: string;
    number: string;
    select_event: string;
    loading_events: string;
    failed_to_load_events: string;
    no_upcoming_events: string;
    proceed_to_payment: string;
    processing: string;
    registration_success: string;
    submission_error: string;
    please_select_event: string;
    selected_event_not_found: string;
    event_full: string;
    already_registered: string;
  };
}

const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default as Dictionary),
  ua: () => import('@/locales/ua.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // Fallback to 'en' if locale is not supported
  return (dictionaries[locale as keyof typeof dictionaries] || dictionaries.en)();
};
