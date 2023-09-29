use std::collections::HashMap;

// derive cloan or copy
pub struct TrieNode {
    pub children: HashMap<char, TrieNode>,
    pub is_completed: bool,
}

impl TrieNode {
    pub fn new() -> Self {
        TrieNode {
            children: HashMap::new(),
            is_completed: false,
        }
    }

    pub fn insert(&mut self, new_word: impl Into<String>) -> &TrieNode {
        let new_word: String = new_word.into();
        let mut chars = new_word.chars();
        let c = match chars.next() {
            Some(c) => c,
            None => {
                self.is_completed = true;
                return self;
            }
        };

        let remaining = chars.collect::<String>();
        let entry = self.children.entry(c).or_insert(TrieNode::new());

        entry.insert(remaining)
    }
    fn search_endings(&self, word: impl Into<String>) -> Vec<String> {
        let mut active_node = self;
        let word = word.into();
        let mut completions = Vec::from([]);
        for character in word.chars() {
            match active_node.children.get(&character) {
                Some(child_node) => {
                    active_node = child_node;
                }
                None => {
                    completions.push(word);
                    return completions;
                }
            }
        }

        TrieNode::search_children(active_node, word, &mut completions);
        completions
    }
    fn search_children<'a>(
        node: &TrieNode,
        word: impl Into<String>,
        completions: &'a mut Vec<String>,
    ) {
        let word = word.into();
        if node.is_completed {
            let new_word = word.clone();
            completions.push(new_word);
        }

        for key in node.children.keys() {
            match node.children.get(key) {
                Some(child_node) => {
                    // if child_node.is_completed {
                    //     let mut new_completion = word.clone();
                    //     new_completion.push(*key);
                    //     completions.push(new_completion);
                    // }
                    let mut new_word = word.clone();
                    new_word.push(*key);
                    TrieNode::search_children(child_node, new_word, completions);
                }
                None => {}
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_works() {
        let root_node = TrieNode::new();
        assert_eq!(root_node.is_completed, false);
        assert_eq!(root_node.children.len(), 0)
    }

    #[test]
    fn insert_single_character() {
        let mut root_node = TrieNode::new();
        root_node.insert("a");

        assert_eq!(root_node.children.len(), 1);

        let new_leaf = root_node.children.get_mut(&'a').unwrap();
        assert_eq!(new_leaf.is_completed, true);
        assert_eq!(new_leaf.children.len(), 0);
    }

    #[test]
    fn insert_many_characters() {
        let mut root_node = TrieNode::new();
        root_node.insert("abc");

        assert_eq!(root_node.children.len(), 1);

        let a_node = root_node.children.get_mut(&'a').unwrap();
        assert_eq!(a_node.is_completed, false);
        assert_eq!(a_node.children.len(), 1);

        let b_node = a_node.children.get_mut(&'b').unwrap();
        assert_eq!(b_node.is_completed, false);
        assert_eq!(b_node.children.len(), 1);

        let c_node = b_node.children.get_mut(&'c').unwrap();
        assert_eq!(c_node.is_completed, true);
        assert_eq!(c_node.children.len(), 0);
    }

    #[test]
    fn insert_many_words() {
        let mut root_node = TrieNode::new();
        root_node.insert("cat");
        root_node.insert("car");
        root_node.insert("cart");

        assert_eq!(root_node.children.len(), 1);

        let c_node = root_node.children.get_mut(&'c').unwrap();
        assert_eq!(c_node.is_completed, false);
        assert_eq!(c_node.children.len(), 1);

        let ca_node = c_node.children.get_mut(&'a').unwrap();
        assert_eq!(ca_node.is_completed, false);
        assert_eq!(ca_node.children.len(), 2);

        match ca_node.children.get(&'r') {
            Some(car_node) => {
                assert_eq!(car_node.is_completed, true);
                assert_eq!(car_node.children.len(), 1);
            }
            None => panic!("did not find car node"),
        }
        match ca_node.children.get(&'t') {
            Some(cat_node) => {
                assert_eq!(cat_node.is_completed, true);
                assert_eq!(cat_node.children.len(), 0);
            }
            None => panic!("did not find cat node"),
        }

        match ca_node.children.get(&'r') {
            Some(car_node) => match car_node.children.get(&'t') {
                Some(cart_node) => {
                    assert_eq!(cart_node.is_completed, true);
                    assert_eq!(cart_node.children.len(), 0);
                }
                None => panic!("did not find cart node"),
            },
            None => panic!("did not find r node"),
        }
    }

    #[test]
    fn search_endings_early_exit() {
        let mut root_node = TrieNode::new();
        root_node.insert("car");
        let completions = root_node.search_endings("cart");

        assert_eq!(completions.len(), 1);
        assert_eq!(completions.get(0).unwrap(), &String::from("cart"));
    }

    #[test]
    fn search_endings_simple_case() {
        let mut root_node = TrieNode::new();
        root_node.insert("cart");
        root_node.insert("car");

        let completions = root_node.search_endings("car");

        assert_eq!(completions.len(), 2);
        assert_eq!(completions.contains(&String::from("car")), true);
        assert_eq!(completions.contains(&String::from("cart")), true);
    }

    #[test]
    fn search_endings_many_case() {
        let mut root_node = TrieNode::new();
        root_node.insert("cart");
        root_node.insert("car");
        root_node.insert("cardigan");
        root_node.insert("cartesian");

        let completions = root_node.search_endings("car");

        assert_eq!(completions.len(), 4);
        assert_eq!(completions.contains(&String::from("car")), true);
        assert_eq!(completions.contains(&String::from("cart")), true);
        assert_eq!(completions.contains(&String::from("cartesian")), true);
        assert_eq!(completions.contains(&String::from("cardigan")), true);
    }
}
